# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0005_auto_20141201_1015'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='file',
            options={'ordering': ('-created',)},
        ),
        migrations.AlterModelOptions(
            name='presentation',
            options={'ordering': ('-created',)},
        ),
        migrations.AlterModelOptions(
            name='weblink',
            options={'ordering': ('-created',)},
        ),
    ]
