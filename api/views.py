import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import update_session_auth_hash
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import permission_classes
from rest_framework import permissions, viewsets, views
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from accounts.models import Account 
from publisher.models import (
	Category, 
	WebLink, 
	File,
	CategorizedFile,
	CategorizedWebLink,
	ApplicationVariable,
)

from .serializers import (
	AccountSerializer,
	CategorySerializer,
	FileSerializer,
	WebLinkSerializer,
	CategorizedWebLinkSerializer,
	CategorizedFileSerializer,
	ApplicationVariableSerializer,
)
from .permissions import (
	IsAccountOwner, 
	IsFileOwner,
	IsWebLinkOwner,
	IsProductCategoryOwner,
	IsAdmin
)


class AccountViewSet(viewsets.ModelViewSet):
	#lookup_field = 'country'
	queryset = Account.objects.all()
	serializer_class = AccountSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (IsAccountOwner(),)
		if self.request.method == 'POST':
			return (permissions.IsAdminUser(),)
		if self.request.method == 'PATCH':
			return (IsAccountOwner(),)
		return (permissions.IsAdminUser(),)
	

	def list(self, request, *args, **kwargs):
		return super(AccountViewSet, self).list(request, *args, **kwargs)


	def create(self, request):
		serializer = self.serializer_class(data=request.DATA)

		if serializer.is_valid():
			try:
				email = request.DATA['email']
				password = request.DATA['password']
				#country = request.DATA['country']
			except KeyError:
				return Response({
					'status': 'BAD REQUEST',
					'message': 'Account could not be created with received data. Missing field(s)'
				}, status=status.HTTP_400_BAD_REQUEST)

			first_name = request.DATA.get('first_name', '')
			last_name = request.DATA.get('last_name', '')

			#user = Account.objects.create_user(email, password, country=country)
			user = Account.objects.create_user(email, password)
			user.set_password(request.DATA.get('password'))
			user.first_name = first_name
			user.last_name = last_name
			
			user.save()

			return Response(serializer.data, status=status.HTTP_201_CREATED)

		return Response({
			'status': 'BAD REQUEST',
			'message': 'Account could not be created with received data'
		}, status=status.HTTP_400_BAD_REQUEST)


	def update(self, request, *args, **kwargs):
		return super(AccountViewSet, self).update(request, *args, **kwargs)



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


class UserPasswordChangeView(views.APIView):
	def post(self, request, format=None):
		try:
			uid = request.GET['uid']
			user = Account.objects.get(pk=int(uid))
		except (KeyError, Account.DoesNotExist):
			return Response({
				'status': 'BAD REQUEST',
				'message': 'Unable to process the request with received data'
			}, status=status.HTTP_400_BAD_REQUEST)

		data =json.loads(request.body)

		old = data.get('oldPassword', None)
		new = data.get('newPassword', None)
		confirm_new = data.get('confirmNewPassword', None)

		if new == confirm_new:
			#check if old pass valid
			valid = user.check_password(old)

			if valid:
				#ok, change password
				user.set_password(confirm_new)
				user.save()

				update_session_auth_hash(self.request, user)

				return Response({
					'status': 'SUCCESS',
					'message': 'Password changed successfully!'
				}, status=status.HTTP_201_CREATED)
			else:
				return Response({
					'status': 'BAD REQUEST',
					'message': 'Password invalid. Please provide a valid actual password.'
				}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({
				'status': 'BAD REQUEST',
				'message': 'Your new password does not match. Please retry.'
			}, status=status.HTTP_400_BAD_REQUEST)
		



class MobileClientLoginView(views.APIView):
	def get(self, request, format=None):
		#data = json.loads(request.body)

		email = request.GET.get('email', None)
		password = request.GET.get('password', None)

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
	#permission_classes = (permissions.IsAuthenticated,)
	def post(self, request, format=None):
		logout(request)
		return Response({}, status=status.HTTP_204_NO_CONTENT)


#	APIVIEWS for the CorePublisher Models
#	Presentation, File, WebLink, Category
#
class CategoryViewSet(viewsets.ModelViewSet):
	queryset = Category.objects.all().order_by('priority')
	serializer_class = CategorySerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)

		return (permissions.IsAuthenticated(), IsAdmin(),)


	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)

		queryset = self.queryset.filter(country=c)
		serializer = self.serializer_class(queryset, many=True, context={'request': request})

		return Response(serializer.data)


class ApplicationVariableViewSet(viewsets.ModelViewSet):
	queryset = ApplicationVariable.objects.all()
	serializer_class = ApplicationVariableSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)
		return (permissions.IsAuthenticated(), IsAdmin(),)

	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
			}, status=status.HTTP_400_BAD_REQUEST)

		qset = self.queryset.filter(country=c)
		serializer = self.serializer_class(qset, many=True)

		return Response(serializer.data)


class ApplicationVariableByNameView(views.APIView):
	def get(self, request, format=None):

		try:
			c = request.GET['country']
			n = request.GET['variableName']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
			}, status=status.HTTP_400_BAD_REQUEST)

		try:
			av = ApplicationVariable.objects.get(variable_name=n, country=c)
		except ApplicationVariable.DoesNotExist:
			return Response({
				'status': 'Not Found',
				'message': 'Could not find an Application Variable with specified params...'
			}, status=status.HTTP_404_NOT_FOUND)

		serializer = ApplicationVariableSerializer(av)
		return Response(serializer.data)



class FileViewSet(viewsets.ModelViewSet):
	queryset = File.objects.all().order_by('-pub_date')
	serializer_class = FileSerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)

		return (permissions.IsAuthenticated(), IsAdmin(),)


	#Logout user if not on secure connection
	def dispatch(self, request, *args, **kwargs):
		if not request.is_secure():
			logout(request)
			return HttpResponseRedirect('http://pure-chamber-7616.herokuapp.com/#/login')

		return super(FileViewSet, self).dispatch(request, *args, **kwargs)


	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)

		qset = self.queryset.filter(country=c)

		try:
			origin = request.GET['origin']
			if origin == 'web':
				filtered_queryset = [x for x in qset]
			else:
				filtered_queryset = []
		except KeyError:
			#request coming from mobile app
			filtered_queryset = [x for x in qset if x.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True, context={'request': request})

		return Response(serializer.data)


	def create(self, request, *args, **kwargs):
		return super(FileViewSet, self).create(request, *args, **kwargs)



	def pre_save(self, obj):
		obj.user = self.request.user
		return super(FileViewSet, self).pre_save(obj)


	def post_save(self, obj, created=False):

		categories = self.request.DATA['categories']
		obj.categories.clear()

		for c in categories.split(','):
			category = Category.objects.filter(name=c, country=obj.country)[0]
			CategorizedFile.objects.create(file_resource=obj, category=category)

		return super(FileViewSet, self).post_save(obj, created)




class WebLinkViewSet(viewsets.ModelViewSet):
	queryset = WebLink.objects.all().order_by('-pub_date')
	serializer_class = WebLinkSerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)

		return (permissions.IsAuthenticated(), IsAdmin(),)


	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)

		qset = self.queryset.filter(country=c)

		try:
			origin = request.GET['origin']
			if origin == 'web':
				filtered_queryset = [x for x in qset]
			else:
				filtered_queryset = []
		except KeyError:
			#request coming from mobile app
			filtered_queryset = [x for x in qset if x.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True, context={'request': request})

		return Response(serializer.data)


	def pre_save(self, obj):
		obj.user = self.request.user
		return super(WebLinkViewSet, self).pre_save(obj)

	def post_save(self, obj, created=False):
		categories = self.request.DATA['categories']
		obj.categories.clear()

		for c in categories.split(','):
			category = Category.objects.filter(name=c, country=obj.country)[0]
			CategorizedWebLink.objects.create(weblink=obj, category=category)

		return super(WebLinkViewSet, self).post_save(obj, created)



class ResourceByCategoryView(views.APIView):
	def get(self, request, *args, **kwargs):
		try:
			categoryID = int(self.request.GET['categoryID'])
			country = self.request.GET['country']
		except KeyError:
			return Response({
					'status': 'BAD REQUEST',
					'message': 'Could not parse the request. Missing field(s)'
				}, status=status.HTTP_400_BAD_REQUEST)

		c = Category.objects.get(pk=categoryID)

		files = [f for f in c.file_set.all() if (f.country == country)]
		filtered_files = [x for x in files if x.is_active]
		fSerializer = FileSerializer(filtered_files, many=True, context={'request': request})

		links = [l for l in c.weblink_set.all() if (l.country == country)]
		filtered_links = [x for x in links if x.is_active]
		lSerializer = WebLinkSerializer(filtered_links, many=True, context={'request': request})

		return Response({
			'files': fSerializer.data,
			'links': lSerializer.data
		})


class CategorizedFileViewSet(viewsets.ModelViewSet):
	queryset = CategorizedFile.objects.all().order_by('position')
	serializer_class = CategorizedFileSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)

		return (permissions.IsAuthenticated(),)


	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
			pk = request.GET['categoryId']

			category = Category.objects.get(pk=pk)
		except (KeyError, Category.DoesNotExist):
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)


		queryset = self.queryset.filter(file_resource__country=c, category=category)
		filtered_queryset = [x for x in queryset if x.file_resource.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True, context={'request': request})

		return Response(serializer.data)



class CategorizedWebLinkViewSet(viewsets.ModelViewSet):
	queryset = CategorizedWebLink.objects.all().order_by('position')
	serializer_class = CategorizedWebLinkSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)
		return (permissions.IsAuthenticated(),)

	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
			pk = request.GET['categoryId']

			category = Category.objects.get(pk=pk)
		except (KeyError, Category.DoesNotExist):
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing...'
				}, status=status.HTTP_400_BAD_REQUEST)

		queryset = self.queryset.filter(weblink__country=c, category=category)
		filtered_queryset = [x for x in queryset if x.weblink.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True, context={'request': request})

		return Response(serializer.data)


class AllCategorizedResourceByCategoryView(views.APIView):
	def get(self, request, *args, **kwargs):
		try:
			categoryID = int(self.request.GET['categoryID'])
			country = self.request.GET['country']
			audience = self.request.GET['audience']

			c = Category.objects.get(pk=categoryID)
		except (KeyError, Category.DoesNotExist):
			return Response({
					'status': 'BAD REQUEST',
					'message': 'Could not parse the request. Missing field(s)'
				}, status=status.HTTP_400_BAD_REQUEST)

		if audience in ['DEVELOPER', 'LILLY_USER']:

			files = [f for f in c.categorized_files.all() if (f.file_resource.country == country)]
			filtered_files = [x for x in files if x.file_resource.is_active]
			fSerializer = CategorizedFileSerializer(filtered_files, many=True, context={'request': request})
			
			links = [l for l in c.categorized_weblinks.all() if (l.weblink.country == country)]
			filtered_links = [x for x in links if x.weblink.is_active]
			lSerializer = CategorizedWebLinkSerializer(filtered_links, many=True, context={'request': request})
		else:

			files = [f for f in c.categorized_files.all() if (f.file_resource.country == country and f.file_resource.audience == 'PUBLIC')]
			filtered_files = [x for x in files if x.file_resource.is_active]
			fSerializer = CategorizedFileSerializer(filtered_files, many=True, context={'request': request})
			
			links = [l for l in c.categorized_weblinks.all() if (l.weblink.country == country and l.weblink.audience == 'PUBLIC')]
			filtered_links = [x for x in links if x.weblink.is_active]
			lSerializer = CategorizedWebLinkSerializer(filtered_links, many=True, context={'request': request})

		return Response({
			'files': fSerializer.data,
			'links': lSerializer.data
		})