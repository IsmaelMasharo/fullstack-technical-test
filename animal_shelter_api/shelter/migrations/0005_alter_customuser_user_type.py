# Generated by Django 5.1 on 2024-08-09 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shelter', '0004_alter_adoption_status_alter_animal_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(choices=[('admin', 'Administrador'), ('volunteer', 'Voluntario'), ('adopter', 'Adoptante')], max_length=10),
        ),
    ]
