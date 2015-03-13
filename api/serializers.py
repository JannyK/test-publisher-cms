import os
from django.contrib.auth import update_session_auth_hash
from django.http import HttpRequest
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from accounts.models import Account 
from publisher.models import (
	Category, 
	File, 
	WebLink,
	CategorizedFile,
	CategorizedWebLink,
	ApplicationVariable,
)

class ApplicationVariableSerializer(serializers.ModelSerializer):
	class Meta:
		model = ApplicationVariable
		fields = (
			'id',
			'variable_name',
			'value',
			'country',
		)

		read_only_fields = ('id',)


class AccountSerializer(serializers.ModelSerializer):
	password = serializers.CharField(source='password', write_only=True, required=False)
	confirm_password = serializers.CharField(write_only=True, required=False)
	api_auth_token = serializers.SerializerMethodField('get_api_auth_token')

	def get_api_auth_token(self, obj):
		try:
			return Token.objects.get(user=obj)
		except Token.DoesNotExist:
			pass
		return ''


	class Meta:
		model = Account
		fields = (
			'id',
			'email',
			'user_type',
			'created_at',
			'updated_at',
			'first_name',
			'last_name',
			'password',
			'api_auth_token',
			'is_admin',
		)
		read_only_fields = ('id', 'created_at', 'updated_at', 'is_admin',)

	def restore_object(self, attrs, instance=None):
		if instance is not None:
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


	def get_validation_exclusions(self, *args, **kwargs):
		ex = super(AccountSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return ex + ['api_auth_token']



class CategorySerializer(serializers.ModelSerializer):
	#picture = serializers.Field('picture.url')
	picture_url = serializers.SerializerMethodField('get_thumbnail_url')
	icon_url = serializers.SerializerMethodField('get_icon_url')

	class Meta:
		model = Category
		fields = (
			'id', 
			'name', 
			'description', 
			'picture', 
			'picture_url',
			'icon', 
			'icon_url',
			'country', 
			'priority',
		)
		read_only_fields = ('id',)

	def get_thumbnail_url(self, obj):
		return self.context['request'].build_absolute_uri(obj.picture.url)

	def get_icon_url(self, obj):
		return self.context['request'].build_absolute_uri(obj.icon.url)


	def get_validation_exclusions(self, *args, **kwargs):
		ex = super(CategorySerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return ex + ['country']


class FileSerializer(serializers.ModelSerializer):
	#pub_date = serializers.DateTimeField(
	#	format=None, input_formats=['YYYY-MM-DDTHH:mm:ss.sssZ'])
	#expiry_date = serializers.DateTimeField(
	#	format=None, input_formats=['YYYY-MM-DDTHH:mm:ss.sssZ'])

	user = AccountSerializer(required=False)
	categories = serializers.SlugRelatedField(many=True, slug_field='name', read_only=True)
	file_type = serializers.SerializerMethodField('get_file_type')
	thumbnail_url = serializers.SerializerMethodField('get_thumbnail_url')

	def get_thumbnail_url(self, obj):
		return self.context['request'].build_absolute_uri(obj.thumbnail.url)

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
			'thumbnail_url',
			'file', 
			'file_type',
			'file_size',
			'created', 
			'pub_date', 
			'expiry_date',
			'zink_number',
			'target_device',
			'country',
			'audience',
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
	thumbnail_url = serializers.SerializerMethodField('get_thumbnail_url')

	def get_thumbnail_url(self, obj):
		return self.context['request'].build_absolute_uri(obj.thumbnail.url)

	class Meta:
		model = WebLink
		fields = (
			'id', 
			'title', 
			'description', 
			'thumbnail', 
			'thumbnail_url',
			'link', 
			'is_third_party',
			'created', 
			'pub_date', 
			'expiry_date',
			'zink_number',
			'target_device',
			'country',
			'audience',
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(WebLinkSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user', 'categories']




class CategorizedFileSerializer(serializers.ModelSerializer):
	file_resource = FileSerializer(many=False, context={'request': HttpRequest()})
	category = CategorySerializer(many=False, context={'request': HttpRequest()})

	class Meta:
		model = CategorizedFile
		fields = (
			'id',
			'file_resource',
			'category',
			'position',
		)
		read_only_fields = ('id',)




class CategorizedWebLinkSerializer(serializers.ModelSerializer):
	weblink = WebLinkSerializer(many=False, context={'request': HttpRequest()})
	category = CategorySerializer(many=False, context={'request': HttpRequest()})

	class Meta:
		model = CategorizedWebLink
		fields = (
			'id',
			'weblink',
			'category',
			'position',
		)
		read_only_fields = ('id',)