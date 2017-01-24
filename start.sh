#!/bin/bash

cd /apps/dist
pm2 start app.js -i 2 --no-daemon
