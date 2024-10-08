#!/bin/sh
set -x
cd dockerfiles
set -e
tag=3007.1
docker build -f dockerfile-saltmaster --tag erwindon/saltgui-saltmaster:$tag --tag erwindon/saltgui-saltmaster:latest .
docker build -f dockerfile-saltminion-ubuntu --tag erwindon/saltgui-saltminion-ubuntu:$tag --tag erwindon/saltgui-saltminion-ubuntu:latest .
docker build -f dockerfile-saltminion-debian --tag erwindon/saltgui-saltminion-debian:$tag --tag erwindon/saltgui-saltminion-debian:latest .
docker build -f dockerfile-saltminion-centos --tag erwindon/saltgui-saltminion-centos:$tag --tag erwindon/saltgui-saltminion-centos:latest .
docker container ls -aq | xargs --no-run-if-empty docker container rm --force
docker images | awk '/^<none>/ {print $3;}' | xargs --no-run-if-empty docker rmi
