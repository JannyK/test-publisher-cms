# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0006_auto_20141202_0834'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='country',
            field=models.CharField(default=b'NO', max_length=10, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK')]),
            preserve_default=True,
        ),
    ]
