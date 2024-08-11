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
    adopter_queryset = CustomUser.objects.filter(user_type=CustomUser.ADOPTER)
    volunteer_queryset = CustomUser.objects.filter(user_type=CustomUser.VOLUNTEER)
    animal = serializers.CharField(source="animal.name", read_only=True)
    adopter = serializers.CharField(source="adopter.username", read_only=True)
    volunteer = serializers.CharField(source="volunteer.username", read_only=True)
    animal_id = serializers.PrimaryKeyRelatedField(queryset=Animal.objects.all())
    adopter_id = serializers.PrimaryKeyRelatedField(queryset=adopter_queryset)
    volunteer_id = serializers.PrimaryKeyRelatedField(
        queryset=volunteer_queryset, allow_null=True
    )

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
            "adopter_id",
            "volunteer_id",
            "animal_id",
        ]

    def custom_fk_parsing(self, instance, validated_data):
        instance.animal = validated_data.pop("animal_id")
        instance.volunteer = validated_data.pop("volunteer_id")
        instance.adopter = validated_data.pop("adopter_id")
        return instance

    def update(self, instance, validated_data):
        instance.animal = validated_data.pop("animal_id")
        instance.volunteer = validated_data.pop("volunteer_id")
        instance.adopter = validated_data.pop("adopter_id")
        return super().update(instance, validated_data)

    def create(self, validated_data):
        validated_data["animal_id"] = validated_data.pop("animal_id").id
        validated_data["adopter_id"] = validated_data.pop("adopter_id").id
        if validated_data["volunteer_id"]:
            validated_data["volunteer_id"] = validated_data.pop("volunteer_id").id
        return super().create(validated_data)


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
