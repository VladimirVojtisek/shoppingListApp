#!/bin/sh
npm install -g json-server
json-server --watch db.json --port 3001&
npm start