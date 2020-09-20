#!/bin/bash
container_name=$1
tag=$2

if [ -z $container_name ]; then
  # Version key/value should be on his own line
  container_name=$DB_NAME
fi
if [ -z $container_name ]; then
  # Version key/value should be on his own line
  container_name='email-service'
fi
echo "container_name = ${container_name}"

if [ -z $tag ]; then
  # Version key/value should be on his own line
  tag='12.2'
fi
echo "tag = ${tag}"

password=$DB_PASS
if [ -z $password ]; then
  password='password'
fi
echo "password = ${password}"

dbport=$DB_PORT
if [ -z $dbport ]; then
  dbport=5432
fi
echo "dbport = ${dbport}"

dbname=$DB_NAME
if [ -z $dbname ]; then
  dbname=${container_name}
fi
echo "dbname = ${dbname}"

docker run -d -p ${dbport}:5432 --name ${container_name} \
  -e POSTGRES_PASSWORD=${password} \
  -e POSTGRES_DB=${dbname} \
  -v /tmp:/tmp \
  postgres:${tag}

echo "Starting ${container_name}"
docker start ${container_name}

if [ ! -z $DB_SCHEMA ]; then
  echo "Creating default schema $DB_SCHEMA for database $dbname"
  sleep 5
  docker exec ${container_name} /bin/bash -c "psql -U postgres $dbname -c 'create schema if not exists $DB_SCHEMA'"
fi