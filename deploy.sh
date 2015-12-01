#!/bin/bash

echo -e "\e[32m starting docker on dev machine \e[39m"
sudo service docker start
echo -e "\e[32m DONE \e[39m"

echo -e "\e[32m pushing latest version to docker hub \e[39m"
docker push alexivar/tictactoe
echo -e "\e[32m DONE \e[39m"

echo -e "\e[32m shutting down the old version of the app and running the new version from docker hub on test machine \e[39m"

ssh vagrant@192.168.33.10 "docker kill foobar && docker rm foobar && docker pull alexivar/tictactoe && docker run -p 8080:8080 --name="foobar" -d -e "NODE_ENV=production" alexivar/tictactoe"
echo -e "\e[32m DONE \e[39m"
