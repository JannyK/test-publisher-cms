import json
from django.contrib.auth import authenticate, login, logout

from rest_framework import permissions, viewsets, views
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from accounts.models import Account 
from publisher.models import Category, Presentation, WebLink, File

from .serializers import (
	AccountSerializer,
	CategorySerializer,
	PresentationSerializer,
	FileSerializer,
	WebLinkSerializer,
)
from .permissions import (
	IsAccountOwner, 
	IsPresentationOwner, 
	IsFileOwner,
	IsWebLinkOwner,
)


class AccountViewSet(viewsets.ModelViewSet):
	lookup_field = 'country'
	queryset = Account.objects.all()
	serializer_class = AccountSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
		if self.request.method == 'POST':
			return (permissions.AllowAny(),)

		return (permissions.IsAuthenticated(), IsAccountOwner(),)

	def create(self, request):
		serializer = self.serializer_class(data=request.DATA)

		if serializer.is_valid():
			try:
				email = request.DATA['email']
				password = request.DATA['password']
				country = request.DATA['country']
			except KeyError:
				return Response({
					'status': 'BAD REQUEST',
					'message': 'Account could not be created with received data. Missing field(s)'
				}, status=status.HTTP_400_BAD_REQUEST)

			user = Account.objects.create_user(email, password, country=country)

			user.set_password(request.DATA.get('password'))

			user.save()

			return Response(serializer.data, status=status.HTTP_201_CREATED)

		return Response({
			'status': 'BAD REQUEST',
			'message': 'Account could not be created with received data'
		}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
	def post(self, request, format=None):
		data = json.loads(request.body)

		email = data.get('email', None)
		password = data.get('password', None)

		user = authenticate(email=email, password=password)

		if user is not None:
			if user.is_active:

				login(request, user)
				serialized = AccountSerializer(user)
				return Response(serialized.data)
			else:
				return Response({
					'status': 'Unauthorized',
					'message': 'This accounts is not active.'
					}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			return Response({
				'status': 'Unauthorized',
				'message': 'Username/password combination is not valid'
				}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(views.APIView):
	permission_classes = (permissions.IsAuthenticated,)

	def post(self, request, format=None):
		logout(request)

		return Response({}, status=status.HTTP_204_NO_CONTENT)


#
#	APIVIEWS for the CorePublisher Models
#	Presentation, File, WebLink, Category
#
class CategoryViewSet(viewsets.ModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
		return (permissions.IsAuthenticated(),)


class PresentationViewSet(viewsets.ModelViewSet):
	queryset = Presentation.objects.all()
	serializer_class = PresentationSerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
		return (permissions.IsAuthenticated(), IsPresentationOwner(),)

	def pre_save(self, obj):
		obj.user = self.request.user
		return super(CategoryViewSet, self).pre_save(obj)


class UserPresentationsViewSet(viewsets.ViewSet):
	queryset = Presentation.objects.select_related('user').all()
	serializer_class = PresentationSerializer

	def list(self, request, user_country=None):
		queryset = self.queryset.filter(user__country=user_country)
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)


class FileViewSet(viewsets.ModelViewSet):
	queryset = File.objects.all()
	serializer_class = FileSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
		return (permissions.IsAuthenticated(), IsFileOwner(),)

	def pre_save(self, obj):
		obj.user = self.request.user
		return super(FileViewSet, self).pre_save(obj)


class UserFilesViewSet(viewsets.ViewSet):
	queryset = File.objects.select_related('user').all()
	serializer_class = FileSerializer

	def list(self, request, user_country=None):
		queryset = self.queryset.filter(user__country=user_country)
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)


class WebLinkViewSet(viewsets.ModelViewSet):
	queryset = WebLink.objects.all()
	serializer_class = WebLinkSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
		return (permissions.IsAuthenticated(), IsWebLinkOwner(),)

	def pre_save(self, obj):
		obj.user = self.request.user
		return super(WebLinkViewSet, self).pre_save(obj)


class UserWebLinksViewSet(viewsets.ViewSet):
	queryset = WebLink.objects.select_related('user').all()
	serializer_class = WebLinkSerializer

	def list(self, request, user_country=None):
		queryset = self.queryset.filter(user__country=user_country)
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)
