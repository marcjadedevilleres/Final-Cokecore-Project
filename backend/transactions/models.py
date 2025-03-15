from django.db import models
from django.contrib.auth import get_user_model
from inventory.models import Product, Warehouse

# Get the correct CustomUser model dynamically
CustomUser = get_user_model()

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('sale', 'Sale'),
        ('purchase', 'Purchase'),
        ('transfer', 'Transfer'),
    )
    
    transaction_id = models.CharField(max_length=255, unique=True)  # Ensure uniqueness
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.transaction_id} ({self.timestamp})"

class TransactionItem(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity} in Transaction {self.transaction.transaction_id}"
