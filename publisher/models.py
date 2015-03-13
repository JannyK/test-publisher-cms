from datetime import datetime

from django.db import models
from django.utils import timezone

from accounts.models import Account

COUNTRY_CHOICES = (
	('NO', 'NORGE'),
	('SE', 'SVERIGE'),
	('DK', 'DANMARK'),
)

AUDIENCE_CHOICES = (
	('DEVELOPER', 'Developer'),
	('LILLY_USER', 'Lilly user'),
	('DEVELOPER_AND_LILLY', 'Developers & Lilly users'),
	('PUBLIC', 'Public audience'),
)

DEVICE_TARGETS = (
	('PHONE', 'PHONE'),
	('TABLET', 'TABLET'),
	('ALL', 'ALL'),
)

class Category(models.Model):
	name = models.CharField(max_length=40)
	description = models.TextField(blank=True)
	picture = models.ImageField(upload_to="categories_thumbnails", blank=True)
	icon = models.ImageField(upload_to="categories_icons", blank=True, null=True)
	country = models.CharField(max_length=10, choices=COUNTRY_CHOICES, default='NO')
	priority = models.PositiveIntegerField(default=100)

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		super(Category, self).save(*args, **kwargs)


class BaseEntryManager(models.Manager):
	def get_queryset(self):
		return super(BaseEntryManager, self).get_queryset().order_by('-pub_date')



class BaseEntry(models.Model):
	
	user = models.ForeignKey(Account)

	title = models.CharField(max_length=255)
	description = models.TextField()
	thumbnail = models.ImageField(upload_to='_thumbnails_', blank=True)
	created = models.DateTimeField(auto_now_add=True)
	pub_date = models.DateTimeField()
	expiry_date = models.DateTimeField(blank=True)
	zink_number = models.CharField(max_length=50, default="NOXXXX")
	country = models.CharField(max_length=10, choices=COUNTRY_CHOICES, default='NO')
	target_device = models.CharField(max_length=25, choices=DEVICE_TARGETS, default='ALL')
	audience = models.CharField(max_length=50, choices=AUDIENCE_CHOICES, default='DEVELOPER')

	objects = BaseEntryManager()

	class Meta:
		abstract = True
		#permissions = (
		#	('view_entry', 'Can see available entries'),
		#	('edit_entry_status', 'Can edit status of available entries'),
		#)

	@property 
	def is_active(self):
		if self.expiry_date:
			return self.pub_date <= timezone.now() and self.expiry_date > timezone.now()
		else:
			return self.pub_date <= timezone.now()


	def __str__(self):
		return 'Entry: %s' % (self.title,)

	def save(self, *args, **kwargs):
		if not self.pub_date:
			self.pub_date = timezone.now()
		if not self.expiry_date:
			pass

		super(BaseEntry, self).save(*args, **kwargs)



class File(BaseEntry):
	categories = models.ManyToManyField(Category, through="CategorizedFile", blank=True)
	file = models.FileField(upload_to='files')
	file_size = models.PositiveIntegerField(default=0)

	def save(self, *args, **kwargs):
		if self.file:
			self.file_size = self.file.size
		super(File, self).save(*args, **kwargs)

	class Meta:
		ordering = ('created',)



class WebLink(BaseEntry):
	categories = models.ManyToManyField(Category, through="CategorizedWebLink", blank=True)
	link = models.URLField(max_length=255)
	is_third_party = models.BooleanField(default=False)

	class Meta:
		ordering = ('created',)



class CategorizedFile(models.Model):
	category = models.ForeignKey(Category, related_name="categorized_files")
	file_resource = models.ForeignKey(File)
	position = models.PositiveIntegerField(default=1)



class CategorizedWebLink(models.Model):
	category = models.ForeignKey(Category, related_name="categorized_weblinks")
	weblink = models.ForeignKey(WebLink)
	position = models.PositiveIntegerField(default=1)


class ApplicationVariable(models.Model):
	variable_name = models.CharField(max_length=255, unique=True)
	value = models.CharField(max_length=255)
	country = models.CharField(max_length=10, default='NO', choices=COUNTRY_CHOICES)

	def __str__(self):
		return 'Application Variable: %s with Value: %s' % (
			self.variable_name, self.value)
