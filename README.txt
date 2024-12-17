------------------------------------------------------------------------------------------------------------------------
NOTE: You find a better format of the instructions on README.md or at our GitHub: https://github.com/sparecattil/SkyFare
------------------------------------------------------------------------------------------------------------------------

# SkyFare

## Versions

- **Node.js:** 23.3.0  
- **Python:** 3.12.6

---

## Project Setup Instructions

### 1. Open Command Prompt / Terminal

- Open **Command Prompt** on Windows or **Terminal** on Unix-like systems.

---

### 2. Navigate to Folder

- Navigate to the checkout folder

---

### 3. Create a Virtual Environment

- Run the following command to create a virtual environment:

  
  python -m venv venv
  

---

### 4. Activate the Virtual Environment

- For **Windows**, use the following command:

  
  venv\Scripts\activate
  

- For **macOS** and **Linux**, use the following command:

  
  source venv/bin/activate
  

---

### 5. Install Python Redis Dependency

- Run the following command to install the required Redis packages:

  
  pip install redis
  

---

### 6. Install Python MongoDB Dependency

- Run the following command to install the required MongoDB packages:

  
  pip install pymongo
  

---

### 7. Install Node.js Dependencies

- Run the following commands to install the required Node.js packages:

  
  npm install express
  

  
  npm install mongodb
  

  
  npm install ioredis
  

- For **Windows**, delete the **package.json** file located outside of the website folder
  
  **Reasoning**: Once express is installed, a new file **package.json** file will be generated and put outside of your website folder. We want to use the **package.json** file located inside the website folder.

---

### 8. Run Redis Server

- Run the following command to run a local instance of the Redis Server:

  
  redis-server
  

---

### 9. Open MongoDB Compass

- Connect to localhost on MongoDB

---

### 10. Add US Airline Flight Routes and Fares 1993-2024 Dataset

- Add the **US Airline Flight Routes and Fares 1993-2024** dataset to the working directory.

- The dataset can be accessed from the following link:

  https://www.kaggle.com/datasets/bhavikjikadara/us-airline-flight-routes-and-fares-1993-2024/data

---

### 11. Populate Redis Database 0

- Run the following command to populate **Redis Database 0**:

  
  python SkyFarePopulateRedis.py
  

- **Approximate wait time:** 2 minutes (Depends on computer specifications).

---

### 12. Populate Redis Database 1 and MongoDB

- Run the following command to populate **Redis Database 1** and **MongoDB**:

  
  python SkyFarePopulateMongo.py
  

- **Approximate wait time:** 30 minutes (Depends on computer specifications).

---

### 13. Run Website Server

- Run the following command to run the website server:

  
  node website/server.js
  

---

### 14. Open Website

- Open a web browser and type the following into the search bar:

  
  localhost:3000
  

