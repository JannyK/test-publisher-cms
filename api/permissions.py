from rest_framework import permissions

class IsAccountOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, account):
		if request.user:
			return account == request.user
		return False


class IsPresentationOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, p):
		if request.user:
			return p.user == request.user
		return False


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
