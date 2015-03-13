# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0008_weblink_is_third_party'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicationvariable',
            name='variable_name',
            field=models.CharField(max_length=255),
            preserve_default=True,
        ),
    ]
