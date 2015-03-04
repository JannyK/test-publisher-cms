# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0004_auto_20150223_1041'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='country',
            field=models.CharField(default=b'NO', max_length=10, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='presentation',
            name='country',
            field=models.CharField(default=b'NO', max_length=10, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='weblink',
            name='country',
            field=models.CharField(default=b'NO', max_length=10, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK')]),
            preserve_default=True,
        ),
    ]
