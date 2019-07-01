#!/bin/bash

docker build -t otto-service . && docker run -p 9998:9998 --rm -d otto-service
