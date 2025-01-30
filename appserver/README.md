
### Overview

App server for scheduling tool


### Stack
Python / django
Docker
Postgres

### Quick commands for dev environment
```
docker compose up

docker compose build 

docker compose exec appserver python manage.py makemigrations

docker compose exec appserver python manage.py migrate

docker compose exec appserver python manage.py createsuperuser

docker compose exec db psql -U myuser -d mydatabase
```


### References

None