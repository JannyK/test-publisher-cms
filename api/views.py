import json
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import permissions, viewsets, views
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from accounts.models import Account 
from publisher.models import (
	Category, 
	Presentation, 
	WebLink, 
	File,
	CategorizedFile,
	CategorizedPresentation,
	CategorizedWebLink,
)

from .serializers import (
	AccountSerializer,
	CategorySerializer,
	PresentationSerializer,
	FileSerializer,
	WebLinkSerializer,
	CategorizedWebLinkSerializer,
	CategorizedPresentationSerializer,
	CategorizedFileSerializer,
)
from .permissions import (
	IsAccountOwner, 
	IsPresentationOwner, 
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
			return (permissions.AllowAny(),)
		if self.request.method == 'POST':
			return (permissions.AllowAny(),)

		#return (permissions.IsAuthenticated(), IsAccountOwner(),)
		return (permissions.IsAuthenticated(), IsAdmin())

	def create(self, request):
		print 'REQUEST USER DATA: ', request.DATA
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

			first_name = request.DATA.get('first_name', '')
			last_name = request.DATA.get('last_name', '')

			user = Account.objects.create_user(email, password, country=country)
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
	permission_classes = (permissions.IsAuthenticated,)

	def post(self, request, format=None):
		logout(request)

		return Response({}, status=status.HTTP_204_NO_CONTENT)


#
#	APIVIEWS for the CorePublisher Models
#	Presentation, File, WebLink, Category
#
class CategoryViewSet(viewsets.ModelViewSet):
	queryset = Category.objects.all().order_by('priority')
	serializer_class = CategorySerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)

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
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)


	#def pre_save(self, obj):
	#	try:
	#		c = self.request.GET['country']
	#	except KeyError:
	#		return Response({
	#			'status': 'Bad Request',
	#			'message': 'Request parameters missing ...'
	#			}, status=status.HTTP_400_BAD_REQUEST)
#
#		#obj.country = self.request.user.country
#		obj.country = c



class PresentationViewSet(viewsets.ModelViewSet):
	queryset = Presentation.objects.all().order_by('-pub_date')
	serializer_class = PresentationSerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)

		return (permissions.IsAuthenticated(), IsPresentationOwner(),)


	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)

		queryset = self.queryset.filter(user__country=c)
		filtered_queryset = [x for x in queryset if x.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True)

		return Response(serializer.data)


	def pre_save(self, obj):
		obj.user = self.request.user

		return super(PresentationViewSet, self).pre_save(obj)


	def post_save(self, obj, created=False):
		categories = self.request.DATA['categories']
		obj.categories.clear()

		for c in categories.split(','):
			category = Category.objects.get(name=c)
			CategorizedPresentation.objects.create(presentation=obj, category=category)
			#obj.categories.add(category)

		return super(PresentationViewSet, self).post_save(obj, created)



class UserPresentationsViewSet(viewsets.ViewSet):
	queryset = Presentation.objects.select_related('user').all()
	serializer_class = PresentationSerializer

	def list(self, request, user_country=None):
		queryset = self.queryset.filter(user__country=user_country)
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)


class FileViewSet(viewsets.ModelViewSet):
	queryset = File.objects.all().order_by('-pub_date')
	serializer_class = FileSerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)

		return (permissions.IsAuthenticated(), IsFileOwner(),)

	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)

		queryset = self.queryset.filter(user__country=c)
		filtered_queryset = [x for x in queryset if x.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True)

		return Response(serializer.data)


	def create(self, request, *args, **kwargs):
		print self.request.DATA 
		print 'REQUEST POST: ', request.POST
		return super(FileViewSet, self).create(request, *args, **kwargs)



	def pre_save(self, obj):
		obj.user = self.request.user
		return super(FileViewSet, self).pre_save(obj)


	def post_save(self, obj, created=False):
		categories = self.request.DATA['categories']
		obj.categories.clear()

		for c in categories.split(','):
			category = Category.objects.get(name=c)
			CategorizedFile.objects.create(file_resource=obj, category=category)
			#obj.categories.add(category)

		return super(FileViewSet, self).post_save(obj, created)



class UserFilesViewSet(viewsets.ViewSet):
	queryset = File.objects.select_related('user').all()
	serializer_class = FileSerializer

	def list(self, request, user_country=None):
		queryset = self.queryset.filter(user__country=user_country)
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)



class WebLinkViewSet(viewsets.ModelViewSet):
	queryset = WebLink.objects.all().order_by('-pub_date')
	serializer_class = WebLinkSerializer
	parser_classes = (FormParser, MultiPartParser,)

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)

		return (permissions.IsAuthenticated(), IsWebLinkOwner(),)


	def list(self, request, *args, **kwargs):
		try:
			c = request.GET['country']
		except KeyError:
			return Response({
				'status': 'Bad Request',
				'message': 'Request parameters missing ...'
				}, status=status.HTTP_400_BAD_REQUEST)

		queryset = self.queryset.filter(user__country=c)
		filtered_queryset = [x for x in queryset if x.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True)

		return Response(serializer.data)


	def pre_save(self, obj):
		obj.user = self.request.user
		return super(WebLinkViewSet, self).pre_save(obj)

	def post_save(self, obj, created=False):
		categories = self.request.DATA['categories']
		obj.categories.clear()

		for c in categories.split(','):
			category = Category.objects.get(name=c)
			CategorizedWebLink.objects.create(weblink=obj, category=category)
			#obj.categories.add(category)

		return super(WebLinkViewSet, self).post_save(obj, created)



class UserWebLinksViewSet(viewsets.ViewSet):
	queryset = WebLink.objects.select_related('user').all()
	serializer_class = WebLinkSerializer

	def list(self, request, user_country=None):
		queryset = self.queryset.filter(user__country=user_country)
		serializer = self.serializer_class(queryset, many=True)

		return Response(serializer.data)



class ResourceByCategoryView(views.APIView):
	def get(self, request, *args, **kwargs):
		try:
			categoryID = int(self.request.GET['categoryID'])
			#userID = int(self.request.GET['userID'])
			country = self.request.GET['country']
		except KeyError:
			return Response({
					'status': 'BAD REQUEST',
					'message': 'Could not parse the request. Missing field(s)'
				}, status=status.HTTP_400_BAD_REQUEST)

		c = Category.objects.get(pk=categoryID)

		pres = [p for p in c.presentation_set.all() if (p.user.country == country)]
		filtered_pres = [x for x in pres if x.is_active]
		pSerializer = PresentationSerializer(filtered_pres, many=True)

		files = [f for f in c.file_set.all() if (f.user.country == country)]
		filtered_files = [x for x in files if x.is_active]
		fSerializer = FileSerializer(filtered_files, many=True)

		links = [l for l in c.weblink_set.all() if (l.user.country == country)]
		filtered_links = [x for x in links if x.is_active]
		lSerializer = WebLinkSerializer(filtered_links, many=True)

		return Response({
			'presentations': pSerializer.data,
			'files': fSerializer.data,
			'links': lSerializer.data
		})


class CategorizedFileViewSet(viewsets.ModelViewSet):
	queryset = CategorizedFile.objects.all().order_by('position')
	serializer_class = CategorizedFileSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)

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


		queryset = self.queryset.filter(file_resource__user__country=c, category=category)
		filtered_queryset = [x for x in queryset if x.file_resource.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True)

		return Response(serializer.data)


class CategorizedPresentationViewSet(viewsets.ModelViewSet):
	queryset = CategorizedPresentation.objects.all().order_by('position')
	serializer_class = CategorizedPresentationSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
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

		queryset = self.queryset.filter(presentation__user__country=c, category=category)
		filtered_queryset = [x for x in queryset if x.presentation.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True)

		return Response(serializer.data)



class CategorizedWebLinkViewSet(viewsets.ModelViewSet):
	queryset = CategorizedWebLink.objects.all().order_by('position')
	serializer_class = CategorizedWebLinkSerializer

	def get_permissions(self):
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
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

		queryset = self.queryset.filter(weblink__user__country=c, category=category)
		filtered_queryset = [x for x in queryset if x.weblink.is_active]

		serializer = self.serializer_class(filtered_queryset, many=True)

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
			categorized_pres = [p for p in c.categorized_presentations.all() if (p.presentation.user.country == country)]
			filtered_pres = [x for x in categorized_pres if x.presentation.is_active]
			pSerializer = CategorizedPresentationSerializer(filtered_pres, many=True)

			files = [f for f in c.categorized_files.all() if (f.file_resource.user.country == country)]
			filtered_files = [x for x in files if x.file_resource.is_active]
			fSerializer = CategorizedFileSerializer(filtered_files, many=True)
			
			links = [l for l in c.categorized_weblinks.all() if (l.weblink.user.country == country)]
			filtered_links = [x for x in links if x.weblink.is_active]
			lSerializer = CategorizedWebLinkSerializer(filtered_links, many=True)
		else:
			categorized_pres = [p for p in c.categorized_presentations.all() if (p.presentation.user.country == country and p.presentation.audience == 'PUBLIC')]
			filtered_pres = [x for x in categorized_pres if x.presentation.is_active]
			pSerializer = CategorizedPresentationSerializer(filtered_pres, many=True)

			files = [f for f in c.categorized_files.all() if (f.file_resource.user.country == country and f.file_resource.audience == 'PUBLIC')]
			filtered_files = [x for x in files if x.file_resource.is_active]
			fSerializer = CategorizedFileSerializer(filtered_files, many=True)
			
			links = [l for l in c.categorized_weblinks.all() if (l.weblink.user.country == country and l.weblink.audience == 'PUBLIC')]
			filtered_links = [x for x in links if x.weblink.is_active]
			lSerializer = CategorizedWebLinkSerializer(filtered_links, many=True)

		return Response({
			'presentations': pSerializer.data,
			'files': fSerializer.data,
			'links': lSerializer.data
		})