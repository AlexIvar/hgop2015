#!/bin/bash

#Assume that the docker image has been built, but not pushed.

#The script must push to docker from your dev machine,
#and pull from docker on the test machine.

#You will need to shut down the old version of the app
#and then run the new version in docker.

#You may need to configure your vagrant boxes to use a private network
#to achieve this.

#Hint: Use ssh remote execution.

#Try to figure this out on your own, resist the temptation to look over the shoulder#of the next person.

sudo service docker start

docker push alexivar/tictactoe

ssh vagrant@192.168.33.10 -c 'docker kill alexivar/tictactoe && docker rm alexivar/tictactoe && docker pull alexivar/tictactoe && docker run alexivar/tictactoe'

