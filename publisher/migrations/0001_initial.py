# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=40)),
                ('description', models.TextField(blank=True)),
                ('picture', models.ImageField(upload_to=b'categories_thumbnails', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('thumbnail', models.ImageField(upload_to=b'_thumbnails_', blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('pub_data', models.DateTimeField()),
                ('expiry_data', models.DateTimeField(blank=True)),
                ('file', models.FileField(upload_to=b'files')),
                ('category', models.ForeignKey(to='publisher.Category')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Presentation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('thumbnail', models.ImageField(upload_to=b'_thumbnails_', blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('pub_data', models.DateTimeField()),
                ('expiry_data', models.DateTimeField(blank=True)),
                ('file', models.FileField(upload_to=b'presentation_files')),
                ('category', models.ForeignKey(to='publisher.Category')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='WebLink',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('thumbnail', models.ImageField(upload_to=b'_thumbnails_', blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('pub_data', models.DateTimeField()),
                ('expiry_data', models.DateTimeField(blank=True)),
                ('link', models.URLField(max_length=255)),
                ('category', models.ForeignKey(to='publisher.Category')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
