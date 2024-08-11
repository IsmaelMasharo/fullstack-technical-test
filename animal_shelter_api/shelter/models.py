from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    ADMIN = "admin"
    VOLUNTEER = "volunteer"
    ADOPTER = "adopter"

    TYPE_CHOICES = [
        (ADMIN, "Administrador"),
        (VOLUNTEER, "Voluntario"),
        (ADOPTER, "Adoptante"),
    ]

    STATUS_CHOICES = [
        ("active", "Activo"),
        ("inactive", "Inactivo"),
    ]

    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    user_type = models.CharField(max_length=10, choices=TYPE_CHOICES)


class Animal(models.Model):
    ADOPTED = "adopted"
    PENDING = "pending_adoption"
    AWAITING = "awaiting_adoption"

    TYPE_CHOICES = [
        ("dog", "Perro"),
        ("cat", "Gato"),
    ]

    STATUS_CHOICES = [
        (ADOPTED, "Adoptado"),
        (PENDING, "En Proceso"),
        (AWAITING, "En Espera"),
    ]

    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=AWAITING)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)


class Adoption(models.Model):
    ADOPTED = "adopted"
    PENDING = "pending_adoption"

    STATUS_CHOICES = [
        (ADOPTED, "Adoptado"),
        (PENDING, "En Proceso"),
    ]

    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    adopter = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="adopter_adoptions"
    )
    volunteer = models.ForeignKey(
        CustomUser,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="volunteer_adoptions",
    )
