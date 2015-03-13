# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0007_auto_20150313_1250'),
    ]

    operations = [
        migrations.AddField(
            model_name='weblink',
            name='is_third_party',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
