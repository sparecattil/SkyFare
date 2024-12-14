python -m venv venv
myvenv\Scripts\activate
npm install express
npm install mongodb
npm install ioredis




To Run redis via docker, ignore this for now
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker exec -it redis-stack redis-cli