import json
from django.contrib.auth import authenticate, login, logout

from rest_framework import permissions, viewsets, views
from rest_framework import status
from rest_framework.response import Response

from accounts.models import Account 

from .serializers import AccountSerializer
from .permissions import IsAccountOwner


class AccountViewSet(viewsets.ModelViewSet):
	lookup_field = 'username'
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
				username = request.DATA['username']
			except KeyError:
				return Response({
					'status': 'BAD REQUEST',
					'message': 'Account could not be created with received data. Missing field(s)'
				}, status=status.HTTP_400_BAD_REQUEST)

			user = Account.objects.create_user(email, password, username=username)

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
		
			

