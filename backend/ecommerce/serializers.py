# ModelSerializer is used to convert your model instances to JSON and vice versa.

from rest_framework import serializers
from .models import *


class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    seller = serializers.CharField(source="seller.username")

    class Meta:
        model = Product
        fields = [
            "public_product_id",
            "title",
            "price",
            "description",
            "image",
            "category",
            "seller",
            "created_at",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None