from rest_framework import serializers
from .models import CustomUser, Animal, Adoption


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "status",
            "user_type",
        ]


class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ["id", "name", "age", "breed", "type", "status"]


class AdoptionSerializer(serializers.ModelSerializer):
    animal = serializers.CharField(source="animal.name", read_only=True)
    adopter = serializers.CharField(source="adopter.get_full_name", read_only=True)
    volunteer = serializers.CharField(source="volunteer.get_full_name", read_only=True)

    class Meta:
        model = Adoption
        fields = [
            "id",
            "created_at",
            "updated_at",
            "animal",
            "volunteer",
            "adopter",
            "status",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "user_type",
        ]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            user_type=validated_data["user_type"],
            password=validated_data["password"],
        )
        return user
