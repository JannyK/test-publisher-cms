FROM python:2.7.8
MAINTAINER JANNY KINENDE LOSHI
EXPOSE 8000
 
RUN mkdir -p /usr/src/app
COPY requirements.txt /usr/src/requirements.txt
 
WORKDIR /usr/src/python
RUN pip install -r /usr/src/requirements.txt
 
ENV DJANGO_SETTINGS_MODULE controlpanel.settings
ENV DATABASE_URL postgres://postgres@db/postgres
ENV REDISTOGO_URL redis://redis:6379
 
WORKDIR /usr/src/app
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
