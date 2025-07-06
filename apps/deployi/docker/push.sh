#!/bin/bash

# Determine the type of build based on the first script argument
BUILD_TYPE=${1:-production}

BUILDER=$(docker buildx create --use)

if [ "$BUILD_TYPE" == "candly" ]; then
    TAG="candly"
    echo PUSHING candly
        docker buildx build --platform linux/amd64,linux/arm64 --pull --rm -t "deployi/deployi:${TAG}" -f 'Dockerfile' --push .
else
    echo  "PUSHING PRODUCTION"
    VERSION=$(node -p "require('./package.json').version")
    docker buildx build --platform linux/amd64,linux/arm64 --pull --rm -t "deployi/deployi:latest" -t "deployi/deployi:${VERSION}" -f 'Dockerfile' --push .
fi

docker buildx rm $BUILDER

