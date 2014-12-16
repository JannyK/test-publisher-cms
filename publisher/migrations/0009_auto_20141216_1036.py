# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0008_auto_20141212_1009'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='file',
            options={'ordering': ('created',)},
        ),
        migrations.AlterModelOptions(
            name='presentation',
            options={'ordering': ('created',)},
        ),
        migrations.AlterModelOptions(
            name='weblink',
            options={'ordering': ('created',)},
        ),
        migrations.AddField(
            model_name='category',
            name='priority',
            field=models.PositiveIntegerField(default=100),
            preserve_default=True,
        ),
    ]
