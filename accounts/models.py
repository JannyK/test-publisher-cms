from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import (
	BaseUserManager,
	AbstractBaseUser,
	PermissionsMixin,
	Group,
	Permission,
)

from rest_framework.authtoken.models import Token

COUNTRY_CHOICES = (
	('NO', 'NORGE'),
	('SE', 'SVERIGE'),
	('DK', 'DANMARK'),
	('ALL', 'ALL COUNTRIES'),
)

USER_GROUPS = (
	('DEVELOPER', 'Developer'),
	('LILLY_USER', 'Lilly user'),
	('TEST_USER', 'Test user'),
)

class AccountManager(BaseUserManager):
	def create_user(self, email, password=None, **kwargs):

		if not email:
			raise ValueError('Users must have a valid email address.')

		#if not kwargs.get('country'):
		#	raise ValueError('Users must have a valid country')

		user = self.model(
			#email=self.normalize_email(email), country=kwargs['country']
			email=self.normalize_email(email)
		)

		user.set_password(password)
		user.save()

		return user

	def create_superuser(self, email, password, **kwargs):
		user = self.create_user(email, password, **kwargs)

		user.is_admin = True
		user.is_staff = True
		user.save()

		return user


class Account(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(unique=True)
	#country = models.CharField(max_length=40, choices=COUNTRY_CHOICES, default='NO')
	user_type = models.CharField(max_length=40, choices=USER_GROUPS, default='DEVELOPER')
	first_name = models.CharField(max_length=40, blank=True)
	last_name = models.CharField(max_length=40, blank=True)

	is_admin = models.BooleanField(default=False)
	is_staff = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	objects = AccountManager()

	USERNAME_FIELD = 'email'
	#REQUIRED_FIELDS = ['country']

	def __unicode__(self):
		return '%s (%s)' % (self.email,)

	def save(self, *args, **kwargs):
		super(Account, self).save(*args, **kwargs)


	def get_full_name(self):
		return ' '.join([self.first_name, self.last_name])

	def get_short_name(self):
		return self.first_name

	def is_an_admin(self):
		return self.user_type in ['DEVELOPER', 'LILLY_USER']
		



#Create API TOKEN FOR EVERY REGISTERED USERS
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_api_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
