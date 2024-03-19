# Grocery Booking API

The Grocery Booking API is a Node.js application designed to facilitate the management of grocery items by administrators and allow users to book multiple grocery items in a single order.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Features

- **Admin Dashboard**: Administrators can add, view, update, and remove grocery items, as well as manage inventory levels.
- **User Interface**: Users can view available grocery items and book multiple items in a single order.
- **Authentication**: JWT-based authentication is implemented to secure admin endpoints.
- **MySQL Database**: Data is stored in a MySQL database, allowing for efficient data management.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```bash
    cd qp-assessment
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up MySQL database:
    - Create a MySQL database and run the SQL script to create the necessary tables.
    - Update the database configuration in the `.env` file.

5. Build and Start the server in local:

    ```bash
    npm run build
    ```
    ```bash
    npm start
    ```

## Usage

- Access the API endpoints using tools like Postman or integrate them into your frontend application.
- Use JWT authentication to access admin endpoints by obtaining a token from the `auth/login` endpoint.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MySQL
- JSON Web Tokens (JWT)
