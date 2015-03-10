# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0005_auto_20150304_1124'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='categorizedpresentation',
            name='category',
        ),
        migrations.RemoveField(
            model_name='categorizedpresentation',
            name='presentation',
        ),
        migrations.RemoveField(
            model_name='presentation',
            name='categories',
        ),
        migrations.DeleteModel(
            name='CategorizedPresentation',
        ),
        migrations.RemoveField(
            model_name='presentation',
            name='user',
        ),
        migrations.DeleteModel(
            name='Presentation',
        ),
        migrations.AddField(
            model_name='file',
            name='target_device',
            field=models.CharField(default=b'ALL', max_length=25, choices=[(b'IPHONE', b'PHONE'), (b'TABLET', b'TABLET'), (b'ALL', b'ALL')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='weblink',
            name='target_device',
            field=models.CharField(default=b'ALL', max_length=25, choices=[(b'IPHONE', b'PHONE'), (b'TABLET', b'TABLET'), (b'ALL', b'ALL')]),
            preserve_default=True,
        ),
    ]
