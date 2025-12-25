# JMP-Backend
# Job Marketplace Backend

Production-ready backend for a job marketplace platform with **Customer**, **Service Provider**, and **Admin** roles.

This backend powers:
- Mobile App (Flutter)
- Admin Panel (Web)

Built using **NestJS**, **PostgreSQL**, and **Firebase OTP authentication**.

---

## 🚀 Tech Stack

- **Node.js** (v18+)
- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **Firebase Admin SDK** (OTP login)
- **JWT Authentication**
- **Swagger / OpenAPI**

---

## 📁 Project Structure

job-marketplace-backend/
├── src/
│ ├── main.ts # Application entry point
│ ├── app.module.ts # Root module
│ ├── modules/ # Feature modules
│ │ ├── auth/ # Authentication (OTP, JWT, roles)
│ │ ├── users/ # User profiles & roles
│ │ ├── jobs/ # Job posting & lifecycle
│ │ ├── bids/ # Bidding system
│ │ ├── wallet/ # Wallet & transactions
│ │ └── admin/ # Admin APIs
│ └── config/ # Configuration files
├── .env.example # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md

markdown
نسخ الكود

---

## 🔑 Features

### Authentication
- Phone OTP login using Firebase
- JWT-based authentication
- Role-based access control (Customer / Provider / Admin)
- Role switching

### Job Marketplace
- Customers post jobs
- Providers bid on jobs
- Job lifecycle:
  - Pending
  - Accepted
  - In Progress
  - Completed
  - Cancelled

### Wallet & Payments
- Wallet system for users
- Escrow-like payment flow
- Automatic commission deduction (20%)
- Transaction history

### Admin
- View users & jobs
- Activate / deactivate users
- View commission reports
- Monitor platform activity

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory. Example:

```env

NODE\_ENV=development

PORT=3000



DB\_HOST=localhost

DB\_PORT=5432

DB\_USERNAME=postgres

DB\_PASSWORD=your\_password

DB\_DATABASE=job\_marketplace



JWT\_SECRET=your\_super\_secret\_key



FIREBASE\_SERVICE\_ACCOUNT={...firebase\_json...}
