#!/bin/bash 

usage()
{
  echo ""
  echo "=================================================="
  echo " Usage:                                           "
  echo "=================================================="
  echo "   run.sh <env_file> <OPTIONAL: container_name>  "
  echo ""
}


env_file=$1
container_name=$2

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ -z $env_file ]; then
  usage
  exit 1
fi

if [[ ! -f ${env_file} ]]; then
  echo "[${env_file}] not exist."
  usage
  exit 1
fi


if [ -z $container_name ]; then
  # Version key/value should be on his own line
  container_name='email-service'
fi
echo "container_name = ${container_name}"

docker build -t phartono/email-service:latest .

docker run --rm -it --name ${container_name} --env-file=${env_file} phartono/email-service:latest