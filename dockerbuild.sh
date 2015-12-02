#!/bin/bash

echo Cleaning...
rm -rf ./dist

echo npm install
npm install

echo bower install

bower install

echo Building app
grunt

rc=$?
if [[ $rc != 0 ]]
	then
		echo grunt build failed. Exiting...
		exit $rc
fi

cp ./Dockerfile ./dist/

cd dist
npm install --production

echo Building docker image
		docker build -t alexivar/tictactoe .

echo "Done"
