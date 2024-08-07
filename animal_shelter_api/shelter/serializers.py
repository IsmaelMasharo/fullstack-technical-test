from rest_framework import serializers
from .models import CustomUser, Animal, Adoption


class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "last_name", "email", "status"]
        extra_kwargs = {"user_type": {"read_only": True}}


class AdopterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "last_name", "email", "status"]
        extra_kwargs = {"user_type": {"read_only": True}}


class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ["id", "name", "age", "breed", "type", "status"]


class AdoptionSerializer(serializers.ModelSerializer):
    animal = AnimalSerializer()
    volunteer = VolunteerSerializer()
    adopter = AdopterSerializer()

    class Meta:
        model = Adoption
        fields = ["id", "date", "animal", "volunteer", "adopter", "status"]
