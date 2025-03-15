from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .models import Transaction
from .serializers import TransactionSerializer, UserSerializer, UserRegistrationSerializer

# Get the correct user model dynamically
CustomUser = get_user_model()

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]  # Restrict to authenticated users

    def perform_create(self, serializer):
        """Ensure that the logged-in user is automatically set as the transaction creator."""
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """Allow admins to see all transactions, but users only see their own."""
        user = self.request.user
        if user.is_staff:  # Admins can see all transactions
            return Transaction.objects.all()
        return Transaction.objects.filter(user=user)  # Users see only their own transactions

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
