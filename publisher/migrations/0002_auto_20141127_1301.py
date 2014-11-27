# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('publisher', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='category',
        ),
        migrations.RemoveField(
            model_name='presentation',
            name='category',
        ),
        migrations.RemoveField(
            model_name='weblink',
            name='category',
        ),
        migrations.AddField(
            model_name='file',
            name='categories',
            field=models.ManyToManyField(to='publisher.Category'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='file',
            name='user',
            field=models.ForeignKey(default=1, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='presentation',
            name='categories',
            field=models.ManyToManyField(to='publisher.Category'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='presentation',
            name='user',
            field=models.ForeignKey(default=1, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='weblink',
            name='categories',
            field=models.ManyToManyField(to='publisher.Category'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='weblink',
            name='user',
            field=models.ForeignKey(default=1, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
