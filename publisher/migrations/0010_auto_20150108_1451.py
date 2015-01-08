# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0009_auto_20141216_1036'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='icon',
            field=models.ImageField(null=True, upload_to=b'categories_icons', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='file',
            name='zink_number',
            field=models.CharField(default=b'NOXXXX', max_length=50),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='presentation',
            name='zink_number',
            field=models.CharField(default=b'NOXXXX', max_length=50),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='weblink',
            name='zink_number',
            field=models.CharField(default=b'NOXXXX', max_length=50),
            preserve_default=True,
        ),
    ]
