**User Management System API

Description**

This project is a RESTful Backend API built using Node.js, Express, and MySQL. It provides a secure system for user registration and authentication. The API follows industry-standard security practices, including password hashing with Bcryptjs and session management using JSON Web Tokens (JWT). Interactive documentation is provided via Swagger UI to allow for easy testing of all endpoints.

**Setup Instructions**

**1. Prerequisites**

Node.js: Ensure you have Node.js installed

XAMPP: Required to run the Apache server and MySQL database.

2. Project Installation
   
Extract the project folder

Open your terminal/command prompt inside the backendNode folder.

Install the required dependencies by running:


-npm install

3**. Database Configuration**

Start XAMPP Control Panel and click "Start" for Apache and MySQL.

Open your browser and navigate to: http://localhost/phpmyadmin

Create a new database named: user_management

Click on the SQL tab and execute the following script to create the table:

CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,
    
    name VARCHAR(100) NOT NULL,
    
    email VARCHAR(150) NOT NULL UNIQUE,
    
    password VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);

4. Environment Variables
   
Create a file named .env in the root folder (where server.js is located) and add:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=user_management
DB_PORT=3306
JWT_SECRET=your_super_secret_key_123

5.** Running the Application**

To start the server, run:

-node server.js
The server will start on http://localhost:3000.

**API Endpoints**

1. **User Registration**
   
Method: POST

URL: /api/users/register

Description: Creates a new user account. Passwords are encrypted before being saved.

Request Body:

JSON

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
Response (201 Created): { "message": "User registered successfully!" }

2. **User Login**
Method: POST

URL: /api/users/login

Description: Verifies credentials and returns a JWT Bearer token.

Request Body:

JSON

{
  "email": "john@example.com",
  "password": "securePassword123"
}
Response (200 OK): { "message": "Login successful", "token": "..." }

3. **Get User List (Protected)**
Method: GET

URL: /api/users

Description: Returns a list of all users. Requires a valid JWT in the Authorization header.

Headers: Authorization: Bearer <token>

Response (200 OK): [ { "id": 1, "name": "John Doe", "email": "john@example.com" } ]

**Technologies Used**

1.**Node.js & Express.js**: Server framework.
2.**MySQL**: Relational database storage.

3.**Bcryptjs**: For secure, one-way password hashing.

4.**JWT (jsonwebtoken**): For secure, stateless authentication.

5.**Swagger UI**: Interactive browser-based API testing (/api-docs).

6.**Dotenv:** For protecting sensitive configuration.

**Challenges Faced**

1.XAMPP MySQL Port Conflict: MySQL failed to start initially due to port 3306 being locked by background processes. Solution: I identified the conflicting processes, cleared the ib_logfile transaction logs, and verified the configuration to ensure a clean database connection.

2.Asynchronous Database Logic: Handling MySQL queries in an asynchronous environment like Node.js required careful callback management. Solution: Used the mysql2 driver to handle connections efficiently.

3.Authentication Workflow: Implementing the transition from login to protected routes was challenging. Solution: Developed a JWT middleware to intercept requests, verify the token, and grant access only to authorized users.

4.JSON Syntax Errors: Encountered 400 Bad Request errors during testing. Solution: Utilized server logs to identify malformed JSON strings in the request body and corrected the data structure in Swagger.
