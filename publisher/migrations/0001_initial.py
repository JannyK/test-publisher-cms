# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CategorizedFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.PositiveIntegerField(default=1)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CategorizedPresentation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.PositiveIntegerField(default=1)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CategorizedWebLink',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.PositiveIntegerField(default=1)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=40)),
                ('description', models.TextField(blank=True)),
                ('picture', models.ImageField(upload_to=b'categories_thumbnails', blank=True)),
                ('icon', models.ImageField(null=True, upload_to=b'categories_icons', blank=True)),
                ('country', models.CharField(default=b'NO', max_length=10, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK')])),
                ('priority', models.PositiveIntegerField(default=100)),
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
                ('created', models.DateField(auto_now_add=True)),
                ('pub_date', models.DateField()),
                ('expiry_date', models.DateField(blank=True)),
                ('zink_number', models.CharField(default=b'NOXXXX', max_length=50)),
                ('file', models.FileField(upload_to=b'files')),
                ('file_size', models.PositiveIntegerField(default=0)),
                ('categories', models.ManyToManyField(to='publisher.Category', through='publisher.CategorizedFile', blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('created',),
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
                ('created', models.DateField(auto_now_add=True)),
                ('pub_date', models.DateField()),
                ('expiry_date', models.DateField(blank=True)),
                ('zink_number', models.CharField(default=b'NOXXXX', max_length=50)),
                ('file', models.FileField(upload_to=b'presentation_files')),
                ('file_size', models.PositiveIntegerField(default=0)),
                ('categories', models.ManyToManyField(to='publisher.Category', through='publisher.CategorizedPresentation', blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('created',),
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
                ('created', models.DateField(auto_now_add=True)),
                ('pub_date', models.DateField()),
                ('expiry_date', models.DateField(blank=True)),
                ('zink_number', models.CharField(default=b'NOXXXX', max_length=50)),
                ('link', models.URLField(max_length=255)),
                ('categories', models.ManyToManyField(to='publisher.Category', through='publisher.CategorizedWebLink', blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('created',),
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='categorizedweblink',
            name='category',
            field=models.ForeignKey(related_name='categorized_weblinks', to='publisher.Category'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='categorizedweblink',
            name='weblink',
            field=models.ForeignKey(to='publisher.WebLink'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='categorizedpresentation',
            name='category',
            field=models.ForeignKey(related_name='categorized_presentations', to='publisher.Category'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='categorizedpresentation',
            name='presentation',
            field=models.ForeignKey(to='publisher.Presentation'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='categorizedfile',
            name='category',
            field=models.ForeignKey(related_name='categorized_files', to='publisher.Category'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='categorizedfile',
            name='file_resource',
            field=models.ForeignKey(to='publisher.File'),
            preserve_default=True,
        ),
    ]
