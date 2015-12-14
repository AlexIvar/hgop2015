#!/bin/bash

#echo -e "\e[32m pushing latest version to docker hub \e[39m"
#docker push alexivar/tictactoe
#echo -e "\e[32m DONE \e[39m"

echo Running revision $2 on port $1

echo -e "\e[32m shutting down the old version of the app and running the new version from docker hub on test machine \e[39m"

ssh vagrant@192.168.33.10 "docker kill tictactoe:$1  && docker rm tictactoe:$1 && docker pull alexivar/tictactoe:$2 && docker run -p 8080:$1 --name tictactoe:$1 -d -e "NODE_ENV=production" alexivar/tictactoe:$2"
echo -e "\e[32m DONE \e[39m"
