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
venv\Scripts\activate
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
## Install Redis Dependency

Run the following command to install the required Redis packages:

```bash
pip install redis
```
## Install MongoDB Dependency

Run the following command to install the required MongoDB packages:

```bash
pip install pymongo
```

To Run redis via docker, ignore this for now
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
docker start redis-stack
docker stop redis-stack
docker exec -it redis-stack redis-cli
exit
