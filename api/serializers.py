import os
from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers

from accounts.models import Account 
from publisher.models import Category, Presentation, File, WebLink


class AccountSerializer(serializers.ModelSerializer):
	password = serializers.CharField(source='password', write_only=True, required=False)
	confirm_password = serializers.CharField(write_only=True, required=False)

	class Meta:
		model = Account
		fields = (
			'id',
			'email',
			'country',
			'user_type',
			'created_at',
			'updated_at',
			'first_name',
			'last_name',
			'password',
		)
		read_only_fields = ('id', 'created_at', 'updated_at',)

	def restore_object(self, attrs, instance=None):
		if instance is not None:
			instance.country = attrs.get('country', instance.country)
			instance.first_name = attrs.get('first_name', instance.first_name)
			instance.last_name = attrs.get('last_name', instance.last_name)
			instance.user_type = attrs.get('user_type', instance.user_type)
			
			password = attrs.get('password', None)
			confirm_password = attrs.get('confirm_password', None)

			if password and confirm_password and password == confirm_password:
				instance.set_password(password)
				instance.save()

				update_session_auth_hash(self.context.get('request'), instance)

			return instance
		return Account(**attrs)



class CategorySerializer(serializers.ModelSerializer):
	#picture = serializers.Field('picture.url')
	class Meta:
		model = Category
		fields = ('id', 'name', 'description', 'picture', 'icon', 'country', 'priority',)
		read_only_fields = ('id',)

	def get_validation_exclusions(self, *args, **kwargs):
		ex = super(CategorySerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return ex + ['country']



class PresentationSerializer(serializers.ModelSerializer):
	#pub_date = serializers.DateTimeField(
		#format='YYYY-MM-DD', input_formats=['YYYY-MM-DD'])
	#expiry_date = serializers.DateTimeField(
		#format='YYYY-MM-DD', input_formats=['YYYY-MM-DD'])
	#categories = serializers.SlugRelatedField(
		#slug_field='id', many=True, required=False, read_only=True)
	user = AccountSerializer(required=False)
	categories = serializers.SlugRelatedField(
		many=True, slug_field='name', required=False, read_only=True)
	file_type = serializers.SerializerMethodField('get_file_type')

	def get_file_type(self, obj):
		filename, extension = os.path.splitext(obj.file.name)
		return extension


	class Meta:
		model = Presentation
		fields = (
			'id', 
			'title', 
			'description', 
			'thumbnail', 
			'file', 
			'file_type',
			'file_size',
			'created', 
			'pub_date', 
			'expiry_date',
			'zink_number',
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created', 'file_size',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(PresentationSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user', 'categories']


class FileSerializer(serializers.ModelSerializer):
	user = AccountSerializer(required=False)
	categories = serializers.SlugRelatedField(many=True, slug_field='name', read_only=True)
	file_type = serializers.SerializerMethodField('get_file_type')

	def get_file_type(self, obj):
		filename, extension = os.path.splitext(obj.file.name)
		return extension


	class Meta:
		model = File
		fields = (
			'id', 
			'title', 
			'description', 
			'thumbnail', 
			'file', 
			'file_type',
			'file_size',
			'created', 
			'pub_date', 
			'expiry_date',
			'zink_number',
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created', 'file_size',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(FileSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user', 'categories']


class WebLinkSerializer(serializers.ModelSerializer):
	user = AccountSerializer(required=False)
	categories = serializers.SlugRelatedField(many=True, slug_field='name', read_only=True)

	class Meta:
		model = WebLink
		fields = (
			'id', 
			'title', 
			'description', 
			'thumbnail', 
			'link', 
			'created', 
			'pub_date', 
			'expiry_date',
			'zink_number',
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(WebLinkSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user', 'categories']