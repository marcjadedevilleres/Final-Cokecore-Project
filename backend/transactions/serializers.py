from rest_framework import serializers
from .models import CustomUser, Transaction, TransactionItem


class TransactionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionItem
        fields = ['id', 'system_code', 'supplier_code', 'item_type', 'item_name',
                  'unit_type', 'quantity', 'unit_price', 'amount', 'requires_return']
       
class TransactionSerializer(serializers.ModelSerializer):
    items = TransactionItemSerializer(many=True, read_only=False)
   
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_id', 'transaction_type', 'warehouse', 'user',
                 'supplier', 'total_amount', 'timestamp', 'notes', 'items']
   
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        transaction = Transaction.objects.create(**validated_data)
       
        for item_data in items_data:
            TransactionItem.objects.create(transaction=transaction, **item_data)
           
        return transaction
   
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        # Update Transaction fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
       
        # Handle existing items (optionally delete if needed)
        instance.items.all().delete()
       
        # Add updated items
        for item_data in items_data:
            TransactionItem.objects.create(transaction=instance, **item_data)
           
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'role']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
   
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'role']
   
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'user')
        )
        return user
