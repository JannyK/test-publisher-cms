# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0007_category_country'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='file_size',
            field=models.PositiveIntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='presentation',
            name='file_size',
            field=models.PositiveIntegerField(default=0),
            preserve_default=True,
        ),
    ]
