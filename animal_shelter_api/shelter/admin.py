from django.contrib import admin
from .models import Animal, CustomUser, Adoption


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "type",
        "status",
    )


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(Adoption)
class AdoptionAdmin(admin.ModelAdmin):
    pass
