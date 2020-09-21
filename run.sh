#!/bin/bash 

usage()
{
  echo ""
  echo "=================================================="
  echo " Usage:                                           "
  echo "=================================================="
  echo "   run.sh <env_file> <OPTIONAL: host_port> <OPTIONAL: container_name> "
  echo ""
}


env_file=$1
host_port=$2
container_name=$3

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


container_port=""
if [ -z ${host_port} ]; then

  if [[ ! -z ${env_file} ]]; then
    echo "<host_port> is not defined. Looking PORT variable from ${env_file} ..."
    container_port=$(grep -e '^PORT=.*' ${env_file} | cut -d '=' -f2)

    if [[ ! -z ${container_port} ]]; then
      host_port=${container_port}
      echo "PORT variable is found! setting <host-port> to ${host_port}"
    else
      echo "PORT variable not found. Skipping <host-port>."
    fi 

  else
    echo "Skipping <host-port>"
  fi
  echo ""
fi

if [[ ! -z ${host_port} ]] && [ -z ${container_port} ]; then
  echo "Setting default container-port to <host-port>."
  container_port=${host_port}
fi

echo "Container name: ${container_name}"
echo "Container Port: ${container_port}"
echo "Host Port: ${host_port}"
echo ""

port_options="-p ${host_port}:${container_port}"


docker build -t phartono/email-service:latest .

docker run --rm -it --name ${container_name} ${port_options} --env-file=${env_file} phartono/email-service:latest