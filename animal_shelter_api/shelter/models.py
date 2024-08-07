from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    TYPE_CHOICES = [
        ("volunteer", "Voluntario"),
        ("adopter", "Adoptante"),
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
    TYPE_CHOICES = [
        ("dog", "Perro"),
        ("cat", "Gato"),
    ]
    STATUS_CHOICES = [
        ("adopted", "Adoptado"),
        ("pending_adoption", "En Adopción"),
        ("awaiting_adoption", "En Espera"),
    ]
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    updated_at = models.DateTimeField("Updated at", auto_now=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="awaiting_adoption"
    )


class Adoption(models.Model):
    STATUS_CHOICES = [
        ("completed_adoption", "Finalizado"),
        ("pending_adoption", "En Proceso"),
    ]
    created_at = models.DateTimeField("Created at", auto_now_add=True)
    adopted_at = models.DateTimeField("Adopted at")
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE)
    volunteer = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="volunteer_adoptions"
    )
    adopter = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="adopter_adoptions"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="en_proceso"
    )
