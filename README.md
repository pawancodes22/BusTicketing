# 🚌 Kutty Travels - Bus Ticket Booking System

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Razorpay](https://img.shields.io/badge/Payment-Razorpay-blue)

A full-stack bus ticket booking application built using **React.js, Redux Toolkit, Node.js, Express.js, SQLite, JWT Authentication, and Razorpay**. The application allows users to register, log in, search bus routes, select seats, make secure online payments, and view their upcoming and past trips.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login
- JWT Authentication
- Protected Routes

### 🎫 Ticket Booking
- Browse Available Bus Routes
- Interactive Seat Selection
- Upcoming & Past Trips
- Real-Time Seat Availability

### 💳 Payments
- Razorpay Payment Gateway
- Server-Side Payment Verification
- Backend Fare Calculation

### ⚡ Concurrency Handling
- Temporary Seat Locking
- Automatic Seat Lock Expiry
- Database Transactions
- UNIQUE Constraints to Prevent Double Booking

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- SQLite

### Payment Gateway
- Razorpay

---

## 📂 Project Structure

```text
client/
│── src/
│── public/

server/
│── controllers/
│── services/
│── routes/
│── middlewares/
│── config/
│── utils/
```

---

## 🔄 Booking Flow

```text
User Login
      │
      ▼
Browse Bus Routes
      │
      ▼
Select Seats
      │
      ▼
Check Seat Availability
      │
      ▼
Create Temporary Seat Locks
      │
      ▼
Razorpay Payment
      │
      ▼
Verify Payment Signature
      │
      ▼
Create Booking
      │
      ▼
Remove Seat Locks
```

---

## ⭐ Key Technical Highlights

- JWT-based Authentication
- Redux Toolkit for State Management
- RESTful API Architecture
- SQLite Relational Database
- Database Transactions
- Seat Locking Mechanism
- Race Condition Handling
- Razorpay Payment Integration
- Server-side Payment Verification using HMAC Signature Validation

---

## 📸 Screenshots

### Home Page

<img width="1883" height="888" alt="image" src="https://github.com/user-attachments/assets/fd8a20f9-c325-4fc6-9c76-bd08f4c1331c" />


### Bus Selection

<img width="1888" height="977" alt="image" src="https://github.com/user-attachments/assets/d4540ed6-67c5-47e8-88f3-c61eb1dc765f" />


### Seat Selection

<img width="1892" height="947" alt="image" src="https://github.com/user-attachments/assets/66a6c563-5d78-4220-b054-1a3beb1b02a8" />


### My Tickets

<img width="1895" height="960" alt="image" src="https://github.com/user-attachments/assets/547f788b-4893-4d0e-a5b0-2ec175de4a10" />


---

## 💻 Installation

Clone the repository

```bash
git clone https://github.com/pawancodes22/BusTicketing.git
```

Install frontend dependencies

```bash
cd client
npm install
npm run dev
```

Install backend dependencies

```bash
cd server
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

JWT_SECRET=your_jwt_secret

RAZORPAY_API_KEY=your_key

RAZORPAY_API_SECRET=your_secret
```

---

## 💡 Challenges Solved

One of the major challenges while building this application was preventing multiple users from booking the same seat simultaneously.

This was solved using:

- Temporary Seat Locks
- Database Transactions
- UNIQUE Constraints
- Secure Razorpay Payment Verification

This combination ensures that the booking process remains reliable even under concurrent booking requests.

---

## 🚀 Future Improvements

- Automatic Refund Handling
- Email Ticket Confirmation

---

## 👨‍💻 Author

**Balivada Pawan Sai**

- 🌐 Portfolio: https://gorgeous-gnome-7097f1.netlify.app
- 💼 LinkedIn: https://www.linkedin.com/in/pawansaibalivada
- 🐙 GitHub: https://github.com/pawancodes22
