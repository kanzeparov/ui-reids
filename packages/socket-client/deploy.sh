#!/bin/bash
scp -r ./lib/* proxy_onder:/home/ubuntu/temp/send/
scp -r ./package.json proxy_onder:/home/ubuntu/temp/send/
scp -r ./.env proxy_onder:/home/ubuntu/temp/send/