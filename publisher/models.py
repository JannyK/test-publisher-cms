from django.db import models
from django.utils import timezone

class Category(models.Model):
	name = models.CharField(max_length=40, unique=True)
	description = models.TextField(blank=True)
	picture = models.ImageField(upload_to="categories_thumbnails", blank=True)

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		super(Category, self).save(*args, **kwargs)

class BaseEntry(models.Model):
	category = models.ForeignKey(Category)

	title = models.CharField(max_length=255)
	description = models.TextField()
	thumbnail = models.ImageField(upload_to='_thumbnails_', blank=True)
	created = models.DateTimeField(auto_now_add=True)
	pub_data = models.DateTimeField()
	expiry_data = models.DateTimeField(blank=True)

	class Meta:
		abstract = True

	def __unicode__(self):
		return 'Entry: %s' % (self.title,)

	def save(self, *args, **kwargs):
		if not self.pub_data:
			self.pub_data = timezone.now()
		if not self.expiry_data:
			pass

		super(Entry, self).save(*args, **kwargs)


class Presentation(BaseEntry):
	file = models.FileField(upload_to='presentation_files')

class File(BaseEntry):
	file = models.FileField(upload_to='files')

class WebLink(BaseEntry):
	link = models.URLField(max_length=255)