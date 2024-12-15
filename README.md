# Project Setup Instructions

Follow these steps to set up the project:

## 1. Create a Virtual Environment

Run the following command to create a virtual environment:

```bash
python -m venv venv
```

## 2. Activate the Virtual Environment

For Windows, use the following command:

```bash
myvenv\Scripts\activate
```

For macOS and Linux, use the following command:

```bash
source venv/bin/activate
```

## 3. Install Node.js Dependencies

Run the following commands to install the required Node.js packages:

```bash
npm install express
```
```bash
npm install mongodb
```
```bash
npm install ioredis
```


To Run redis via docker, ignore this for now
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker start redis-stack
docker stop redis-stack
docker exec -it redis-stack redis-cli
exit