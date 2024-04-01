# Motorcycle Repair Shop Management Website

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## Introduction

Welcome to the **Motorcycle Repair Shop Management Website** README. This web application is designed to streamline the management of motorcycle repair shops. It provides a user-friendly interface for various tasks related to repair shop management, including inventory management, employee management, customer management, service ticket tracking, and invoicing.

## Features

The key features of this website include:

1. **Inventory Management**
   - Add, update, and delete motorcycle parts and accessories.
   - Track stock levels and receive low-stock alerts.
   
2. **Employee Management**
   - Add and manage information about employees.
   - Assign roles and permissions to employees.
   
3. **Account Management**
   - Manage user accounts and authentication.
   - Implement role-based access control for enhanced security.
   
4. **Customer Management**
   - Store and access customer details.
   - Track customer repair history.
   
5. **Service Ticket Management**
   - Create, update, and close service tickets.
   - Assign tickets to specific employees.
   
6. **Invoicing**
   - Generate and send invoices to customers.
   - Track payment status and history.
   
7. **Reporting**
   - Generate reports on sales, inventory, and employee performance.
   
8. **User-friendly Interface**
   - Utilizes React and Ant Design for an intuitive and responsive frontend.

## Technologies Used

The website is built using the following technologies:

- **Frontend**
  - React: A JavaScript library for building user interfaces.
  - Ant Design: A popular UI framework for React applications.
  
- **Backend**
  - Spring Boot: A Java-based framework for building robust and scalable backend applications.
  
- **Database**
  - MySQL: A popular relational database management system.

## Installation

To set up and run the application locally, follow these steps:

1. Clone the repository:

```shell
git clone https://github.com/thangndgit/sapo-mock-project.git
cd sapo-mock-project
```

2. Install frontend dependencies:

```shell
cd frontend
npm install
```

3. Install backend dependencies (if applicable):

```shell
cd backend
mvn install
```

4. Configure the application by providing necessary environment variables, database connection details, and any other configuration settings.

5. Start the frontend and backend servers:

```shell
cd frontend
npm run dev
```

```shell
cd backend
mvn spring-boot:run
```

6. Access the website at `http://127.0.0.1:5173/` in your web browser.
