#!/bin/bash


BUILD_TYPE=${1:-production}

BUILDER=$(docker buildx create --use)

if [ "$BUILD_TYPE" == "main" ]; then
    TAG="main"
    echo PUSHING main
        docker buildx build --platform linux/amd64,linux/arm64 --pull --rm -t "deployit/deployit:${TAG}" -f 'Dockerfile' --push .
else
    echo  "PUSHING PRODUCTION"
    VERSION=$(node -p "require('./package.json').version")
    docker buildx build --platform linux/amd64,linux/arm64 --pull --rm -t "deployit/deployit:latest" -t "deployit/deployit:${VERSION}" -f 'Dockerfile' --push .
fi

docker buildx rm $BUILDER

