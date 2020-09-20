#!/bin/bash
container_name=$1
tag=$2

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

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# execute rundb.sh
echo "Execute rundb.sh"
${DIR}/rundb.sh ${container_name} ${tag}

status=$(docker ps -qf "name=$container_name" --format='{{.Status}}')
[[ -n $status ]] && docker exec -it ${container_name} bash || echo "${container_name} NOT running"