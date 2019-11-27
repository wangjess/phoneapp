from rest_framework import serializers
from .models import User

class UserPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ('email', 'password', 'codename')
