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
			'created_at',
			'updated_at',
			'first_name',
			'last_name',
			'password',
			#'confirm_password',
		)
		read_only_fields = ('created_at', 'updated_at',)

	def restore_object(self, attrs, instance=None):
		if instance is not None:
			instance.country = attrs.get('country', instance.country)
			password = attrs.get('password', None)
			confirm_password = attrs.get('confirm_password', None)

			if password and confirm_password and password == confirm_password:
				instance.set_password(password)
				instance.save()

				update_session_auth_hash(self.context.get('request'), instance)

			return instance
		return Account(**attrs)


class CategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = Category
		fields = ('id', 'name', 'description', 'picture',)
		read_only_fields = ('id',)


class PresentationSerializer(serializers.ModelSerializer):
	categories = CategorySerializer(required=True)
	user = AccountSerializer(required=False)

	class Meta:
		model = Presentation
		fields = (
			'id', 
			'title', 
			'description', 
			'thumbnail', 'file', 
			'created', 
			'pub_date', 
			'expiry_date',
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(PresentationSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user']


class FileSerializer(serializers.ModelSerializer):
	categories = CategorySerializer(required=True)
	user = AccountSerializer(required=False)

	class Meta:
		model = File
		fields = (
			'id', 
			'title', 
			'description', 
			'thumbnail', 
			'file', 
			'created', 
			'pub_date', 
			'expiry_date',
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(FileSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user']


class WebLinkSerializer(serializers.ModelSerializer):
	categories = CategorySerializer(required=True)
	user = AccountSerializer(required=False)

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
			'categories',
			'user',
		)
		read_only_fields = ('id', 'created',)

	def get_validation_exclusions(self, *args, **kwargs):
		exclusions = super(WebLinkSerializer, self).get_validation_exclusions(
			*args, **kwargs)
		return exclusions + ['user']




