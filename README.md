# SkyFare

## Versions

- **Node.js:** 23.3.0  
- **Python:** 3.12.6

---

## Project Setup Instructions

### 1. Open Command Prompt / Terminal

- Open **Command Prompt** on Windows or **Terminal** on Unix-like systems.

---

### 2. Create a Virtual Environment

- Run the following command to create a virtual environment:

  ```bash
  python -m venv venv
  ```

---

### 3. Activate the Virtual Environment

- For **Windows**, use the following command:

  ```bash
  venv\Scripts\activate
  ```

- For **macOS** and **Linux**, use the following command:

  ```bash
  source venv/bin/activate
  ```

---

### 4. Install Python Redis Dependency

- Run the following command to install the required Redis packages:

  ```bash
  pip install redis
  ```

---

### 5. Install Python MongoDB Dependency

- Run the following command to install the required MongoDB packages:

  ```bash
  pip install pymongo
  ```

---

### 6. Install Node.js Dependencies

- Run the following commands to install the required Node.js packages:

  ```bash
  npm install express
  ```

  ```bash
  npm install mongodb
  ```

  ```bash
  npm install ioredis
  ```

---

### 7. Run Redis Server Locally

- Run a local instance of the Redis Server

```bash
  redis-server
  ```

---

### 8. Open MongoDB Compass

- Connect to localhost on MongoDB

---

### 9. Add US Airline Flight Routes and Fares 1993-2024 Dataset

- Add the **US Airline Flight Routes and Fares 1993-2024 Dataset** to the working directory.

- The dataset can be accessed from the following link:

  [US Airline Flight Routes and Fares 1993-2024 Dataset](https://www.kaggle.com/datasets/bhavikjikadara/us-airline-flight-routes-and-fares-1993-2024/data)

---

### 10. Populate Redis Database 0

- Run the following command to populate **Redis Database 0**:

  ```bash
  python SkyFarePopulateRedis.py
  ```

- **Approximate wait time:** 2 minutes (Depends on computer specifications).

---

### 11. Populate Redis Database 1 and MongoDB

- Run the following command to populate **Redis Database 1** and **MongoDB**:

  ```bash
  python SkyFarePopulateMongo.py
  ```

- **Approximate wait time:** 30 minutes (Depends on computer specifications).

---

### 12. Run Website Server

- Run the following command to run the website server:

  ```bash
  node website/server.js
  ```

---

### 13. Open Website

- Open a web browser and type the following into the search bar:

```bash
  localhost:3000
  ```

