#!/usr/bin/env bash
# exit on error
set -o errexit
pip3 install django
pip3 install psycopg2
pip3 install backports.zoneinfo
python manage.py collectstatic --no-input
python manage.py migrate
