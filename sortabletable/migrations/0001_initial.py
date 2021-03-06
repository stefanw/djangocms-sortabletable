# Generated by Django 3.0.8 on 2020-08-04 10:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cms', '0022_auto_20180620_1551'),
    ]

    operations = [
        migrations.CreateModel(
            name='SortableTablePlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, related_name='sortabletable_sortabletableplugin', serialize=False, to='cms.CMSPlugin')),
                ('title', models.CharField(max_length=255)),
                ('csv_data', models.TextField()),
                ('settings', models.JSONField(blank=True, default=dict)),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin', models.Model),
        ),
    ]
