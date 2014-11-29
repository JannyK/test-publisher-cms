# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0002_auto_20141127_1301'),
    ]

    operations = [
        migrations.RenameField(
            model_name='file',
            old_name='expiry_data',
            new_name='expiry_date',
        ),
        migrations.RenameField(
            model_name='file',
            old_name='pub_data',
            new_name='pub_date',
        ),
        migrations.RenameField(
            model_name='presentation',
            old_name='expiry_data',
            new_name='expiry_date',
        ),
        migrations.RenameField(
            model_name='presentation',
            old_name='pub_data',
            new_name='pub_date',
        ),
        migrations.RenameField(
            model_name='weblink',
            old_name='expiry_data',
            new_name='expiry_date',
        ),
        migrations.RenameField(
            model_name='weblink',
            old_name='pub_data',
            new_name='pub_date',
        ),
    ]
