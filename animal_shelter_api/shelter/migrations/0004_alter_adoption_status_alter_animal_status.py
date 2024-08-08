# Generated by Django 5.1 on 2024-08-08 02:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shelter', '0003_alter_adoption_volunteer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adoption',
            name='status',
            field=models.CharField(choices=[('adopted', 'Adoptado'), ('pending_adoption', 'En Proceso')], default='en_proceso', max_length=20),
        ),
        migrations.AlterField(
            model_name='animal',
            name='status',
            field=models.CharField(choices=[('adopted', 'Adoptado'), ('pending_adoption', 'En Proceso'), ('awaiting_adoption', 'En Espera')], default='awaiting_adoption', max_length=20),
        ),
    ]
