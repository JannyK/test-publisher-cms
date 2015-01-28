"""
Django settings for controlpanel project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

here = lambda * x: os.path.join(os.path.abspath(os.path.dirname(__file__)), *x)
PROJECT_ROOT = here('..')
root = lambda * x: os.path.join(os.path.abspath(PROJECT_ROOT), *x)


AUTH_USER_MODEL = 'accounts.Account'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'fj(jcj!ns6%)(b#mf^y-^frlq6n*h!%8wltr-irjxu(eg@xtkf'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', False)

TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'compressor',
    'storages',
    'accounts',
    'publisher',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

#TEMPLATE_CONTEXT_PROCESSOR += (
 #   'django.core.context_processors.media',
#)

ROOT_URLCONF = 'controlpanel.urls'

WSGI_APPLICATION = 'controlpanel.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
import dj_database_url

DATABASES = {}

#DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.sqlite3',
#        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#    }
#}

#DATABASES = {
#    'default': dj_database_url.config(
#        default='sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
#    )
#}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'nb-no'

TIME_ZONE = 'Europe/Oslo'

USE_I18N = True

USE_L10N = True

USE_TZ = True

DATABASES['default'] = dj_database_url.config()
DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql_psycopg2'


# Add to your settings file
#CONTENT_TYPES = ['image', 'video']
# 2.5MB - 2621440
# 5MB - 5242880
# 10MB - 10485760
# 20MB - 20971520
# 50MB - 5242880
# 100MB 104857600
# 250MB - 214958080
# 500MB - 429916160
MAX_UPLOAD_SIZE = "104857600"

# STORAGES CONFIG
AWS_ACCESS_KEY_ID = 'AKIAILO2HWO3ZGPDYBYA'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'controlpanel-dev'
AWS_AUTO_CREATE_BUCKET = True
AWS_QUERYSTRING_AUTH = False

# AWS cache settings, don't change unless you know what you're doing:
AWS_EXPIREY = 60 * 60 * 24 * 7
AWS_HEADERS = {
    'Cache-Control': 'max-age=%d, s-maxage=%d, must-revalidate' % (AWS_EXPIREY,
        AWS_EXPIREY)
}

# See: http://django-storages.readthedocs.org/en/latest/backends/amazon-S3.html#settings
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
#STATICFILES_STORAGE = DEFAULT_FILE_STORAGE


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

MEDIA_ROOT = root('..', 'uploads')
#MEDIA_URL = '/media/'
STATIC_URL = 'https://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME


STATIC_URL = '/static/'
STATIC_ROOT = root('..', 'staticfiles')
#STATIC_URL = 'https://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME
ADMIN_MEDIA_PREFIX = '/static/admin'

STATICFILES_DIRS = (
    root('..', 'assets'),
    #root('..', 'release/assets'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

COMPRESS_ENABLED = os.environ.get('COMPRESS_ENABLED', False)

TEMPLATE_DIRS = (
    root('..', 'templates'),
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    )
}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']