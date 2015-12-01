#!/bin/bash

echo Cleaning...
rm -rf ./dist

echo Building app
grunt
[ $? -eq 0 ] || exit $?;

cp ./Dockerfile ./dist/

cd dist
npm install --production

echo Building docker image
		docker build -t alexivar/tictactoe .

echo "Done"
