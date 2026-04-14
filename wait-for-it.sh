#!/bin/sh
# wait-for-it.sh - Wait for TCP port

set -e

host_port="$1"
shift
cmd="$@"

echo "Waiting for $host_port..."

while ! nc -z ${host_port%:*} ${host_port#*:}; do
  echo "Still waiting for $host_port..."
  sleep 1
done

echo "$host_port is up - executing command"
exec $cmd
