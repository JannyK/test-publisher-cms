# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20150126_1013'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='user_type',
            field=models.CharField(default=b'DEVELOPER', max_length=40, choices=[(b'DEVELOPER', b'Developer'), (b'LILLY_USER', b'Lilly user'), (b'TEST_USER', b'Test user')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='account',
            name='country',
            field=models.CharField(default=b'NO', max_length=40, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK'), (b'ALL', b'ALL COUNTRIES')]),
            preserve_default=True,
        ),
    ]
