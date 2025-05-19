# Rent-Kar

**Rent-Kar** is a delivery management system designed to streamline the process of managing orders, delivery partners, and order assignments. This application provides a seamless backend and frontend experience for delivery operations.

---

## 📝 Overview

Rent-Kar helps manage:
- **Orders:** Creation, updates, and tracking.
- **Delivery Partners:** Managing profiles, status, and performance metrics.
- **Assignments:** Assigning orders to partners and monitoring progress.

---

## 🚀 Features

- 📦 **Order Management:** Create, update, and track delivery orders.
- 🚴 **Partner Management:** Manage delivery partners and their statuses.
- 📋 **Assignment Tracking:** Assign and monitor delivery assignments.
- 🖥 **User-Friendly Interface:** Clean, modern UI for easy navigation.
- 🌐 **RESTful API:** Well-structured and scalable API for integration.

---

## 🛠 Technologies Used

### Backend
- **Node.js** – JavaScript runtime environment.
- **Express** – Web framework for building APIs.
- **MongoDB** – NoSQL database.
- **Mongoose** – ODM for MongoDB.

### Frontend
- **React.js** – Library for building user interfaces.
- **Axios** – HTTP client for API calls.
- **Tailwind CSS** – Styling the frontend.

---

## 🧰 Installation

Follow these steps to set up the project locally:

### 🔁 Clone the Repository

```bash
git clone https://github.com/yourusername/Rent-Kar.git
cd Rent-Kar
```

---

### 📦 Backend Setup

```bash
cd backend
npm install
```

#### 📄 Create `.env` File

Inside the `backend` directory, create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=your_port_number
```

#### ▶️ Run the Backend Server

```bash
npm start
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### 📦 Orders
- `GET /api/orders` – Retrieve all orders.
- `POST /api/orders` – Create a new order.
- `PUT /api/orders/:id` – Update an order.
- `DELETE /api/orders/:id` – Delete an order.

### 🚴 Partners
- `GET /api/partners` – Retrieve all partners.
- `POST /api/partners` – Create a new partner.
- `PUT /api/partners/:id` – Update a partner.
- `DELETE /api/partners/:id` – Delete a partner.

### 📋 Assignments
- `GET /api/assignments` – Retrieve all assignments.
- `POST /api/assignments` – Create a new assignment.

---

##  Video Link

https://drive.google.com/file/d/19gVlpq-yNjbmUUS2wdRa0gx1sJ08ruF0/view?usp=drivesdk 

---

##  Live Link

https://smart-delivery-rentkar.netlify.app/
---


## 📬 Contact

**Your Name:** vinayakandhere4@gmail.com 
For any inquiries or feedback, feel free to get in touch!

---
