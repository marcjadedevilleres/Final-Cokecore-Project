from rest_framework import serializers
from .models import CustomUser, Warehouse, Product  # Import Warehouse and Product models

# Serializer for CustomUser
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'role']
        read_only_fields = ['id']

# Serializer for user registration
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

# Add the missing WarehouseSerializer
class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse  # Ensure this matches your Warehouse model in models.py
        fields = '__all__'  # Adjust fields as necessary

# Add the missing ProductSerializer
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product  # Ensure this matches your Product model in models.py
        fields = '__all__'  # Adjust fields as necessary
