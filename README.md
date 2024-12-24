# Simple Portfolio Tracker

This project is a **Simple Portfolio Tracker** that allows users to manage their stock portfolio by tracking the value of their holdings, profit/loss, and portfolio distribution. The application includes a React frontend and a Spring Boot backend, integrated with a MySQL database and Twelve Data API for real-time stock prices.

---

## Features

### Frontend

-   Built with React and styled using TailwindCSS.
-   Displays stock details such as symbol, price, quantity, and profit/loss.
-   Calculates portfolio metrics like total value, top-performing stock, and distribution.
-   Dynamically updates stock prices using the Twelve Data API.
-   Responsive design for desktop and mobile views.

### Backend

-   Built with Java Spring Boot.
-   REST API for managing user data, stock data, and portfolio metrics.
-   Integration with MySQL for persistent data storage.
-   Secure authentication and API key handling.

---

## Prerequisites

-   Node.js (>= 16.x)
-   Java Development Kit (JDK) (>= 17)
-   MySQL Server (>= 8.x)
-   Twelve Data API Key

---

## Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shevilll/SimplePortfolioTracker.git
cd SimplePortfolioTracker
```

---

### 2. Setup Backend

#### Navigate to Backend Directory

```bash
cd backend
```

#### Update Database Configuration

Edit `application.properties` in `src/main/resources/` to configure your MySQL connection:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_tracker
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=update
```

#### Build and Run Backend

```bash
./mvnw spring-boot:run
```

The backend will run at `http://localhost:8080`.

---

### 3. Setup Frontend

#### Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Get Twelve Data API Key

#### Start Development Server

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## Running the Application

1. Start the backend server (`http://localhost:8080`).
2. Start the frontend server (`http://localhost:5173`).
3. Open your browser and navigate to `http://localhost:5173`.

---

## API Endpoints (Backend)

### User Endpoints

-   **POST** `/api/users/register`: Register a new user.
-   **POST** `/api/users/login`: User login.

### Stock Endpoints

-   **GET** `/api/stocks`: Fetch all stocks.
-   **POST** `/api/stocks`: Add a new stock to the portfolio.
-   **DELETE** `/api/stocks/{id}`: Remove a stock from the portfolio.

---

## Folder Structure

### Frontend

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   └── main.jsx     # Main entry point
└── package.json
```

### Backend

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── com.example.controller/  # Controllers
│   │   │   ├── com.example.service/     # Services
│   │   │   ├── com.example.model/       # Models
│   │   │   └── com.example.repository/  # Repositories
│   │   └── resources/
│   │       └── application.properties   # Configurations
└── pom.xml
```

---

## Deployment

### Frontend

-   Used a platform **Vercel**.
-   Build the app for production:
    ```bash
    npm run build
    ```
-   Deploy the `build` folder.

### Backend

-   Used a platform **Render**.
-   Package the app as a JAR file:
    ```bash
    ./mvnw package
    ```
-   Deploy the generated JAR file.

---

## Credits

-   **Frontend**: React, TailwindCSS
-   **Backend**: Spring Boot
-   **Database**: MySQL
-   **Stock Data**: Twelve Data API

---
