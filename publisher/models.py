from django.db import models
from django.utils import timezone

from accounts.models import Account

COUNTRY_CHOICES = (
	('NO', 'NORGE'),
	('SE', 'SVERIGE'),
	('DK', 'DANMARK'),
)

class Category(models.Model):
	name = models.CharField(max_length=40, unique=True)
	description = models.TextField(blank=True)
	picture = models.ImageField(upload_to="categories_thumbnails", blank=True)
	country = models.CharField(max_length=10, choices=COUNTRY_CHOICES, default='NO')

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		super(Category, self).save(*args, **kwargs)


class BaseEntry(models.Model):
	categories = models.ManyToManyField(Category, blank=True)
	user = models.ForeignKey(Account)

	title = models.CharField(max_length=255)
	description = models.TextField()
	thumbnail = models.ImageField(upload_to='_thumbnails_', blank=True)
	created = models.DateField(auto_now_add=True)
	pub_date = models.DateField()
	expiry_date = models.DateField(blank=True)

	class Meta:
		abstract = True


	def __unicode__(self):
		return 'Entry: %s' % (self.title,)

	def save(self, *args, **kwargs):
		if not self.pub_date:
			self.pub_date = timezone.now()
		if not self.expiry_date:
			pass

		super(BaseEntry, self).save(*args, **kwargs)


class Presentation(BaseEntry):
	file = models.FileField(upload_to='presentation_files')
	file_size = models.PositiveIntegerField(default=0)

	def save(self, *args, **kwargs):
		if self.file:
			self.file_size = self.file.size 

		super(Presentation, self).save(*args, **kwargs)


	class Meta:
		ordering = ('-created',)


class File(BaseEntry):
	file = models.FileField(upload_to='files')
	file_size = models.PositiveIntegerField(default=0)

	def save(self, *args, **kwargs):
		if self.file:
			self.file_size = self.file.size
		super(File, self).save(*args, **kwargs)


	class Meta:
		ordering = ('-created',)


class WebLink(BaseEntry):
	link = models.URLField(max_length=255)

	class Meta:
		ordering = ('-created',)