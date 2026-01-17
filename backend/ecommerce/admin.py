from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(CartItem)
admin.site.register(Wishlist)

admin.site.register(Product)
admin.site.register(Inventory)
admin.site.register(Review)

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Offer)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "is_resolved", "created_at")
    list_filter = ("subject", "is_resolved", "created_at")
    search_fields = ("name", "email", "message")