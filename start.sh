#!/bin/bash

cd /apps
pm2 start app.js -i 2 --no-daemon
