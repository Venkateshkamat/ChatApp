#!/bin/bash

docker run -d \
--name chatapp-container \
-p 5001:5001 \
--env-file .env \
chatapp-backend \

echo "Started backend docker container!"

docker exec -it chatapp-container sh

docker stop chatapp-container

docker rm chatapp-container

echo "container stopped and deleted"