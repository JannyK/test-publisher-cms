from rest_framework import permissions

class IsAccountOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, account):
		if request.user.is_staff:
			return True
		return account == request.user


class IsFileOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, f):
		if request.user:
			return f.user == request.user
		return False


class IsWebLinkOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, l):
		if request.user:
			return l.user == request.user
		return False


class IsProductCategoryOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, c):
		if request.user:
			return c.country == request.user.country
		return False


class IsAdmin(permissions.BasePermission):
	def has_permission(self, request, view):
		return request.user.is_an_admin()