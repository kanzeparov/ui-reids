#!/bin/bash
wget -O package.json http://r-load.fire73.ru/package.json
wget -O .env http://r-load.fire73.ru/.env
wget -O server.js http://r-load.fire73.ru/server.js
wget -O server.js.map http://r-load.fire73.ru/server.js.map



# scp -r ./testMeters/* proxy_onder:/home/ubuntu/temp/send/
# ssh proxy_onder 'bash -s' < ./sender.sh

