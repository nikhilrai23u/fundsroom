FundsRoom CRM & Inventory Management System
Overview

FundsRoom CRM & Inventory Management System is a full-stack web application built to manage customers, inventory, stock movements, and sales challans.

The application provides role-based authentication, customer relationship management, inventory tracking, and sales challan generation with automatic stock updates.

Features
Authentication & Authorization
JWT-based authentication
Secure login system
User roles:
Admin
Sales
Warehouse
Accounts
Customer CRM Module

Manage customer information and follow-ups.

Features:

Add customer
Edit customer
View customer details
Search customers
Add follow-up notes

Customer fields:

Name
Mobile Number
Email
Business Name
GST Number (Optional)
Customer Type
Retail
Wholesale
Distributor
Address
Status
Lead
Active
Inactive
Follow-up Date
Notes
Product & Inventory Module

Manage products and inventory stock.

Features:

Add product
Edit product
Track inventory
Minimum stock alerts

Product fields:

Product Name
SKU
Category
Unit Price
Current Stock
Minimum Stock Alert Quantity
Warehouse / Location
Stock Movement Tracking

Every stock change is logged.

Tracked information:

Product
Quantity
Movement Type (IN / OUT)
Reason
Created By
Timestamp
Sales Challan Module

Create and manage sales challans.

Features:

Select customer
Add multiple products
Multiple quantities
Auto-generated challan numbers
Draft challans
Confirmed challans
Challan detail page
Printable challan

Business Rules:

Stock cannot become negative
Stock is deducted only when challan is confirmed
Insufficient stock returns an error
Product information is stored as snapshots

Challan fields:

Challan Number
Customer
Products
Total Quantity
Status
Created By
Created Date
Tech Stack
Frontend
React
TypeScript
React Router
Axios
Tailwind CSS
Lucide React
Backend
Node.js
Express.js
TypeScript
Prisma ORM
JWT Authentication
Bcrypt
Database
PostgreSQL
Project Structure
fundsroom/

├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   └── lib/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
└── README.md
Environment Variables
Backend (.env)
DATABASE_URL=postgresql://username:password@localhost:5432/fundsroom

JWT_SECRET=your_jwt_secret

PORT=3000
Frontend (.env)
VITE_API_URL=http://localhost:3000/api
Installation & Setup
1. Clone Repository
git clone <repository-url>

cd fundsroom
2. Backend Setup

Navigate to backend:

cd backend

Install dependencies:

npm install

Generate Prisma Client:

npx prisma generate

Run migrations:

npx prisma migrate dev

Start server:

npm run dev

Backend runs on:

http://localhost:5000
3. Frontend Setup

Navigate to frontend:

cd frontend

Install dependencies:

npm install

Start frontend:

npm run dev

Frontend runs on:

http://localhost:5173
API Endpoints
Authentication
POST /auth/login
Customers
GET    /customers
GET    /customers/:id
POST   /customers
PUT    /customers/:id
Customer Follow Ups
POST /customers/:id/followups
Products
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
Stock Movements
GET /stock-movements
Challans
GET    /challans
GET    /challans/:id
POST   /challans
PUT    /challans/:id
POST   /challans/:id/confirm
Architecture

The application follows a layered architecture:

Frontend
Pages
Components
API Service Layer
Backend
Routes
Controllers
Prisma ORM
PostgreSQL Database

Data flow:

Frontend
   ↓
Express Routes
   ↓
Controllers
   ↓
Prisma ORM
   ↓
PostgreSQL
Deployment

The project can be deployed using:

Frontend:

Vercel
Netlify

Backend:

Render
Railway
Fly.io

Database:

Neon
Supabase
Render PostgreSQL
Assumptions
All users are pre-created in the database.
Product prices are stored as snapshots in challans.
Stock updates occur only on confirmed challans.
Draft challans do not affect inventory.
Known Limitations
Advanced role permissions are not enforced.
Product image upload is not implemented.
PDF export is not implemented.
Pagination may be limited for large datasets.
Audit logs are limited to stock movements.
Submission Contents

Included:

Source Code
GitHub Repository
Database Schema
API Endpoints
Setup Instructions

Additional Deliverables:


Author

Nikhil

Built as part of the FundsRoom Full Stack Assignment.
