from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import CustomUser


class IsVolunteerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_superuser
                or request.user.user_type == CustomUser.VOLUNTEER
            )
        )


class IsAdopter(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.user_type == CustomUser.ADOPTER
        )


class IsAdminOrReadOnlyVolunteer(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        if (
            request.user.user_type == CustomUser.VOLUNTEER
            and request.method in SAFE_METHODS
        ):
            return True
        return False


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        return request.user.is_superuser
