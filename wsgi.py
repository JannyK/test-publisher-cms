import sys
import os
import site

sys.stdout = sys.stderr

site.addsitedir('~/.virtualenvs/cms/local/lib/python2.7/site-packages')

sys.path.insert(0, "")
sys.path.insert(0, "/home/ubuntu")
sys.path.insert(0, "/home/ubuntu/test-publisher-cms")
os.environ['DJANGO_SETTINGS_MODULE'] = 'controlpanel.settings'

import django
django.setup()

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()