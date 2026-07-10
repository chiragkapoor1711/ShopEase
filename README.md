# 🛒 ShopEase - Modern E-Commerce Platform

ShopEase is a modern full-stack e-commerce web application built with **Next.js**, **MySQL**, and **Tailwind CSS**. It provides a seamless shopping experience for customers while offering dedicated dashboards for administrators and sellers to manage products, categories, orders, customers, and reports.

---
## 🚀 Live Demo

**Deployed on Vercel:**
https://shop-ease-bice-nine.vercel.app/

---
## 🚀 Features

### 👤 User
- User Registration & Login
- JWT Authentication
- Secure Cookies
- Role-Based Access
- Profile Management
- Change Password
- Responsive Design
- Dark Mode

### 👨‍💼 Admin
- Separate Admin Login
- Admin Dashboard
- Create Seller Account
- Seller Management
- Profile Management
- Change Password

### 🛍 Seller Dashboard
- Dashboard Overview
- Categories Management (UI)
- Products Management (UI)
- Orders Management (UI)
- Customers Management (UI)
- Reports Dashboard (UI)
- Store Settings (UI)
- Responsive Seller Panel

### 🌐 Website
- Home Page
- About Page
- Login
- Signup
- Forgot Password
- Custom 404 Page
- Responsive Navbar
- Profile Drawer
- Dark/Light Theme

---

# 🛠 Tech Stack

### Frontend
- Next.js 15/16
- React.js
- Tailwind CSS
- Lucide React Icons
- React Hot Toast

### Backend
- Next.js API Routes
- JWT Authentication
- bcryptjs
- MySQL

### Database
- MySQL

---

# 📂 Folder Structure

```text
src/
│
├── app/
│   ├── api/
│   ├── admin/
│   ├── seller/
│   ├── dashboard/
│   ├── login/
│   ├── signup/
│   ├── about/
│   ├── profile/
│   └── change-password/
│
├── components/
│   ├── seller/
│   ├── admin/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ThemeProvider.jsx
│
├── context/
│
├── lib/
│
└── middleware.js
```

---

# 🔐 Authentication

- JWT Authentication
- HttpOnly Cookies
- Protected Routes
- Role-Based Middleware

Roles Supported

- User
- Seller
- Admin

---

# 📊 Seller Dashboard

✔ Dashboard

✔ Categories

✔ Products

✔ Orders

✔ Customers

✔ Reports

✔ Settings

Features

- Responsive Sidebar
- Summary Cards
- Search
- Filter
- Sort
- Pagination
- Delete Confirmation Modal
- Toast Notifications

---

# 🎨 UI Features

- Fully Responsive
- Dark Mode
- Glassmorphism Forms
- Animated Cards
- Hover Effects
- Profile Drawer
- Modern Dashboard
- Mobile Friendly
- Clean UI

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/your-username/shopease.git
```

Go to project

```bash
cd shopease
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

# ⚙ Environment Variables

Create a `.env.local`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopease

JWT_SECRET=your_secret_key
```

---



# 🚀 Future Improvements

- Product CRUD
- Category CRUD
- Order Management
- Customer Management
- Wishlist
- Cart
- Checkout
- Razorpay Integration
- Stripe Integration
- Image Upload
- Email Verification
- Password Reset via Email
- Notifications
- Analytics Dashboard

---

# 📌 Project Status

Current Status

✅ Authentication

✅ Authorization

✅ Role Based Dashboard

✅ Seller Dashboard UI

✅ Admin Dashboard

✅ Responsive Design

🚧 Backend CRUD (In Progress)

🚧 Payment Gateway

🚧 Product Management APIs

---

# 👨‍💻 Author

**Chirag Kapoor**



## ⭐ If you like this project, don't forget to give it a Star!