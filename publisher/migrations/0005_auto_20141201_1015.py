# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0004_auto_20141201_0840'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='categories',
            field=models.ManyToManyField(to='publisher.Category', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='presentation',
            name='categories',
            field=models.ManyToManyField(to='publisher.Category', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='weblink',
            name='categories',
            field=models.ManyToManyField(to='publisher.Category', blank=True),
            preserve_default=True,
        ),
    ]
