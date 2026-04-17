# 🏋️ Gym Management System - RDBMS Lab Project

This is a simple, easy-to-understand CRUD application designed for an RDBMS Lab assignment and Viva examination.

## 📂 Project Structure

```text
📁 LabCA
 ┣ 📄 package.json       (Node.js dependencies)
 ┣ 📄 database.sql       (SQL commands for PostgreSQL)
 ┣ 📄 db.js              (Database connection logic)
 ┣ 📄 server.js          (Express Backend Server & API Routes)
 ┣ 📄 README.md          (Instructions & Viva Prep)
 ┗ 📁 public             (Frontend Files)
   ┣ 📄 index.html       (UI structure)
   ┣ 📄 style.css        (Visual styling)
   ┗ 📄 script.js        (Logic: fetching APIs, handling clicks)
```

---

## 🚀 Steps to Run the Project

### Step 1: Database Setup (pgAdmin)
1. Open **pgAdmin**.
2. Right-click on **Databases** > Create > Database... and name it `gym_db`.
3. Right-click on `gym_db` > **Query Tool**.
4. Open the `database.sql` file, copy all the contents, paste them into the Query Tool, and click the **Run (Play)** button.

### Step 2: Backend Setup
1. Open up a terminal / command prompt in the project folder (`LabCA`).
2. Install the necessary dependencies by running:
   ```bash
   npm install
   ```
3. Open `db.js` and change the `password: 'your_password'` field to match **YOUR** pgAdmin password.
4. Start the server:
   ```bash
   node server.js
   ```
   *You should see `Connected to PostgreSQL database successfully!` and `Server is running on http://localhost:3001` in the terminal.*

### Step 3: Frontend (Viewing the App)
1. Since the backend serves the frontend files automatically, simply open your web browser and go to:
   **[http://localhost:3001](http://localhost:3001)**
2. You can now Add, View, Edit, Delete, and Search for members!

---

## 🧠 VERY IMPORTANT FOR VIVA 🧠

### 1. How does the Database Connection work?
We use the `pg` (node-postgres) library in `db.js`.
- We create a **Connection Pool** (`new Pool({...})`).
- A Pool manages multiple database connections efficiently. Instead of opening and closing a direct connection for every single query (which is slow), the Pool gives out an active connection, runs the query, and then takes the connection back to be reused.

### 2. How do the CRUD Operations work?
- **C**reate (`POST /add`): The frontend sends JSON data (name, membership, phone) to the backend. Express extracts it from `req.body` and runs an `INSERT` statement to save it to Postgres.
- **R**ead (`GET /all`): The backend runs a `SELECT *` query, retrieves all members, and sends them back as a JSON array. The frontend uses JavaScript (`forEach()`) to generate HTML table rows dynamically.
- **U**pdate (`PUT /update/:id`): The URL contains the ID of the person we want to modify. The frontend sends the newly typed data. The backend uses the `UPDATE` SQL query. 
- **D**elete (`DELETE /delete/:id`): Like Update, it receives the ID via the URL path (`req.params.id`), and executes a `DELETE` SQL query to remove that specific row.

#### What is `async/await`?
Database queries don't happen instantly. `await` forces JavaScript to pause and *wait* until the database finishes saving/fetching the data before moving to the next line of code, rather than crashing because the data isn't ready.

#### What is `fetch()`?
In `script.js`, `fetch()` is a built-in browser function. We use it to make HTTP requests (GET, POST, PUT, DELETE) from our Frontend (HTML page) to our Backend (Express Server).

### 3. SQL Queries Used
All queries use Parameterized Array format (`$1`, `$2`) to stop "SQL Injection" hacking.
1. **CREATE**: `INSERT INTO members (member_name, membership_type, phone_number) VALUES ($1, $2, $3)`
2. **READ**: `SELECT * FROM members ORDER BY member_id ASC`
3. **UPDATE**: `UPDATE members SET member_name = $1, membership_type = $2, phone_number = $3 WHERE member_id = $4`
4. **DELETE**: `DELETE FROM members WHERE member_id = $1`
5. **SEARCH (Extra Marks)**: `SELECT * FROM members WHERE member_name ILIKE $1` (`ILIKE` performs a case-insensitive search).

---
*Good luck with your lab assignment! 🎉*
