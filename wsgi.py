import sys
import os
import site

sys.stdout = sys.stderr

sys.path.insert(0, "/home/ubuntu")
sys.path.insert(0, "/home/ubuntu/test-publisher-cms")
os.environ['DJANGO_SETTINGS_MODULE'] = 'controlpanel.settings'

import django
django.setup()

import django.core.handlers.wsgi
from dj_static import Cling, MediaCling

application = Cling(django.core.handlers.wsgi.WSGIHandler())