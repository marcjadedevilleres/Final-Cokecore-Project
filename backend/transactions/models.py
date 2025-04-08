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
        ('receive', 'Receive'),  # Added receive type
    )
   
    transaction_id = models.CharField(max_length=255, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    supplier = models.CharField(max_length=255, blank=True, null=True)  # Added supplier field
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.transaction_type} - {self.transaction_id} ({self.timestamp})"


class TransactionItem(models.Model):
    UNIT_TYPES = (
        ('box', 'Box'),
        ('case', 'Case'),
        ('bottle', 'Bottle'),
        ('shell', 'Shell'),
    )
   
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    system_code = models.CharField(max_length=100, blank=True, null=True)
    supplier_code = models.CharField(max_length=100, blank=True, null=True)
    item_type = models.CharField(max_length=100, blank=True, null=True)
    item_name = models.CharField(max_length=255, blank=True, null=True)
    unit_type = models.CharField(max_length=20, choices=UNIT_TYPES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    requires_return = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.item_name} x {self.quantity} {self.unit_type} in Transaction {self.transaction.transaction_id}"
