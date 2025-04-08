from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .models import Transaction, TransactionItem
from .serializers import TransactionSerializer, UserSerializer, UserRegistrationSerializer
from inventory.models import Product, Warehouse
import traceback

# Get the correct user model dynamically
CustomUser = get_user_model()

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        """Ensure that the logged-in user is automatically set as the transaction creator."""
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """Allow admins to see all transactions, but users only see their own."""
        user = self.request.user
        if not user.is_authenticated:
            return Transaction.objects.none()
        if user.is_staff:  # Admins can see all transactions
            return Transaction.objects.all()
        return Transaction.objects.filter(user=user)  # Users see only their own transactions

    @action(detail=False, methods=['post'])
    def receive_items(self, request):
        """Handle receiving items from the frontend."""
        if not request.data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract data from the request
        try:
            receive_data = request.data
            warehouse_id = request.data.get('warehouse', None)
            
            if not warehouse_id:
                return Response({'error': 'Warehouse is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create transaction record
            transaction = Transaction.objects.create(
                transaction_id=receive_data.get('receiveNo'),
                transaction_type='receive',
                warehouse_id=warehouse_id,
                user=request.user,
                supplier=receive_data.get('supplier', 'Unknown Supplier'),
                total_amount=receive_data.get('totalAmount', 0),
                notes=receive_data.get('remarks', '')
            )
            
            # Process items
            items = receive_data.get('items', [])
            for item in items:
                # Check if we have direct unit_type, quantity, unit_price format
                if item.get('unit_type') and item.get('quantity') and item.get('unit_price'):
                    # Process direct format
                    try:
                        # Try to find product or create placeholder
                        product, created = Product.objects.get_or_create(
                            system_code=item.get('systemCode', ''),
                            defaults={
                                'name': item.get('itemName', 'Unknown Product'),
                                'description': f"Auto-created from receiving: {item.get('itemType', '')}"
                            }
                        )
                        
                        TransactionItem.objects.create(
                            transaction=transaction,
                            product=product,
                            system_code=item.get('systemCode', ''),
                            supplier_code=item.get('supplierCode', ''),
                            item_type=item.get('itemType', ''),
                            item_name=item.get('itemName', ''),
                            unit_type=item.get('unit_type'),
                            quantity=float(item.get('quantity')),
                            unit_price=float(item.get('unit_price')),
                            amount=float(item.get('amount', 0)),
                            requires_return=item.get('requiresReturn', False)
                        )
                    except Exception as e:
                        print(f"Error processing direct item: {e}")
                        traceback.print_exc()
                else:
                    # Process nested format (loop through units)
                    for unit_type in ['box', 'case', 'bottle', 'shell']:
                        quantity = item.get('quantity', {}).get(unit_type, '')
                        price = item.get('supplierPrice', {}).get(unit_type, '')
                        
                        if quantity and price:
                            try:
                                # Try to find product or create placeholder
                                product, created = Product.objects.get_or_create(
                                    system_code=item.get('systemCode', ''),
                                    defaults={
                                        'name': item.get('itemName', 'Unknown Product'),
                                        'description': f"Auto-created from receiving: {item.get('itemType', '')}"
                                    }
                                )
                                
                                # Calculate amount
                                qty = float(quantity)
                                unit_price = float(price)
                                amount = qty * unit_price
                                
                                TransactionItem.objects.create(
                                    transaction=transaction,
                                    product=product,
                                    system_code=item.get('systemCode', ''),
                                    supplier_code=item.get('supplierCode', ''),
                                    item_type=item.get('itemType', ''),
                                    item_name=item.get('itemName', ''),
                                    unit_type=unit_type,
                                    quantity=qty,
                                    unit_price=unit_price,
                                    amount=amount,
                                    requires_return=item.get('requiresReturn', False)
                                )
                            except Exception as e:
                                print(f"Error processing {unit_type} item: {e}")
                                traceback.print_exc()
            
            # Return the created transaction
            serializer = TransactionSerializer(transaction)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            # Enhanced error reporting
            error_traceback = traceback.format_exc()
            print("Error in receive_items:", error_traceback)
            return Response({
                'error': str(e),
                'traceback': error_traceback
            }, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Allow new users to register."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Return the authenticated user's details."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)