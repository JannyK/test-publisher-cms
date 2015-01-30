# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='audience',
            field=models.CharField(default=b'DEVELOPER', max_length=50, choices=[(b'DEVELOPER', b'Developer'), (b'LILLY_USER', b'Lilly user'), (b'DEVELOPER_AND_LILLY', b'Developers & Lilly users'), (b'PUBLIC', b'Public audience')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='presentation',
            name='audience',
            field=models.CharField(default=b'DEVELOPER', max_length=50, choices=[(b'DEVELOPER', b'Developer'), (b'LILLY_USER', b'Lilly user'), (b'DEVELOPER_AND_LILLY', b'Developers & Lilly users'), (b'PUBLIC', b'Public audience')]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='weblink',
            name='audience',
            field=models.CharField(default=b'DEVELOPER', max_length=50, choices=[(b'DEVELOPER', b'Developer'), (b'LILLY_USER', b'Lilly user'), (b'DEVELOPER_AND_LILLY', b'Developers & Lilly users'), (b'PUBLIC', b'Public audience')]),
            preserve_default=True,
        ),
    ]
