from django.contrib.auth.models import User
from .models import Game
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class GameSerializer(serializers.ModelSerializer):   
    class Meta:
        model = Game
        fields = ["id", "board", "created_at", "password", "turn", "ended", "playerOne", "playerTwo", "previous", "next", "winner"]
        extra_kwargs = {
            "playerOne": {"read_only": True},
        }

    def create(self, validated_data):
        game = Game.objects.create(**validated_data)
        return game

class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        help_text="Enter the game password"
)
    
class JoinSerializer(serializers.Serializer):
    id = serializers.IntegerField(
        required=True,
        help_text="Enter the ID for the game you want to join"
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        help_text="Enter the game password"
    )
    
class TurnSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    x = serializers.IntegerField(min_value=0, max_value=2)
    y = serializers.IntegerField(min_value=0, max_value=2)
    
class ResponseSerializer(serializers.Serializer):
    status = serializers.IntegerField()
    board = serializers.JSONField()

class NextSerializer(serializers.Serializer):
    id = serializers.IntegerField()