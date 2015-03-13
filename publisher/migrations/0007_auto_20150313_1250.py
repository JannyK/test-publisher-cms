# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0006_auto_20150310_0952'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicationVariable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('variable_name', models.CharField(unique=True, max_length=255)),
                ('value', models.CharField(max_length=255)),
                ('country', models.CharField(default=b'NO', max_length=10, choices=[(b'NO', b'NORGE'), (b'SE', b'SVERIGE'), (b'DK', b'DANMARK')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='file',
            name='target_device',
            field=models.CharField(default=b'ALL', max_length=25, choices=[(b'PHONE', b'PHONE'), (b'TABLET', b'TABLET'), (b'ALL', b'ALL')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='weblink',
            name='target_device',
            field=models.CharField(default=b'ALL', max_length=25, choices=[(b'PHONE', b'PHONE'), (b'TABLET', b'TABLET'), (b'ALL', b'ALL')]),
            preserve_default=True,
        ),
    ]
