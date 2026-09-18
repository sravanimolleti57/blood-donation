# BloodConnect — Real-Time Blood Donation Platform 🩸

> **"Every Drop Can Save a Life"**  
> *Connecting donors, hospitals, and communities when every second matters.*

BloodConnect is a complete, production-grade MERN stack application designed to bridge critical emergency blood supply gaps. It empowers blood donors, enables verified hospitals to issue urgent blood requests, and provides administrators with system-wide oversight.

---

## 🌟 Key Features

### 🔐 Authentication & Security
- **Role-Based Access Control**: Multi-portal experience for **Donors**, **Hospitals**, and **Admins**.
- **JWT Authentication**: JSON Web Tokens for stateless session management with Bearer token headers and auto-expiry protection.
- **Bcrypt Password Security**: Mandatory password hashing before database persistence.
- **Strict Form Validation**: Email syntax checking, 10-digit Indian phone validation, and strong password policy (`Password123!`).
- **Protected Routes**: Frontend and backend authorization middleware preventing cross-role access.

### 🩸 Donor Experience
- **Interactive Donor Portal**: Personal dashboard with availability toggle, donation history, and stats.
- **Donor Profile Management**: Editable personal, location, and blood group details.
- **Blood Request Directory**: View live emergency requirements posted by hospitals in your city.

### 🏥 Hospital & Blood Bank Experience
- **Hospital Verification State**: Clear display of admin verification status (`Verified` vs `Pending Verification`).
- **Emergency Request Creator**: Form to publish urgent blood group requests with required units and urgency levels.
- **Request Tracker**: View active and completed facility requests.

### 🛡️ Admin Experience
- **System Administration Panel**: Platform statistics (Total Users, Donors, Hospitals, Active Requests).
- **User Management**: Searchable directory of all users with role filter tabs.
- **Hospital Verification Manager**: One-click actions to verify or revoke hospital facility licenses.
- **Platform Control**: Global security toggles and configuration settings.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript, React Router DOM v6, Tailwind CSS, Axios, React Icons, Context API.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`, `cors`.

---

## 📂 Project Architecture

```
blood-donation/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── BloodGroupBadge.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── donor/
│   │   │   │   ├── DonorDashboard.jsx
│   │   │   │   ├── DonorProfile.jsx
│   │   │   │   ├── DonationHistory.jsx
│   │   │   │   └── DonorRequests.jsx
│   │   │   ├── hospital/
│   │   │   │   ├── HospitalDashboard.jsx
│   │   │   │   ├── HospitalProfile.jsx
│   │   │   │   ├── CreateRequest.jsx
│   │   │   │   └── HospitalRequests.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Hospitals.jsx
│   │   │       ├── Requests.jsx
│   │   │       └── Settings.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedAdmin.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🍃 MongoDB Atlas Setup Guide

Follow these steps to connect your cloud-based **MongoDB Atlas** cluster:

1. **Create Account & Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create a free account.
   - Build a free `M0 Sandbox` cluster in your preferred region.

2. **Database User Setup**:
   - Navigate to **Database Access** under Security.
   - Click **Add New Database User**. Choose **Password** authentication.
   - Set a username (e.g. `bloodconnect_admin`) and strong password. Grant **Read and write to any database** privileges.

3. **Network Access Setup**:
   - Navigate to **Network Access** under Security.
   - Click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current IP address.

4. **Obtain Connection String**:
   - Navigate to **Database Deployments**, click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string format:
     `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bloodconnect?retryWrites=true&w=majority`

5. **Configure Backend Environment**:
   - Open `backend/.env` in your project editor.
   - Replace `MONGO_URI` with your actual connection string (replacing `<username>`, `<password>`, and cluster URL).

6. **Verify Persistence**:
   - Start the backend server (`npm run dev` inside `/backend`).
   - Look for the console message: `[MongoDB Atlas] Connected successfully to host: ...`.
   - Register a new donor or hospital on the frontend. Open your Atlas dashboard -> **Browse Collections** to confirm the document created in `bloodconnect.users`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bloodconnect?retryWrites=true&w=majority
JWT_SECRET=your_super_strong_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@bloodconnect.org
ADMIN_PASSWORD=AdminPassword123!
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run Locally

### 1. Start Backend API Server
```bash
cd backend
npm install
npm run dev
```
*Console output:*
```
[BloodConnect Server] Server running on port 5000
[MongoDB Atlas] Connected successfully to host: ...
[Seed Admin] Built-in Admin account created: admin@bloodconnect.org
```

### 2. Start Frontend Vite Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Application available at:* `http://localhost:5173`

---

## 📡 API Endpoints Summary

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Donor or Hospital account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `POST` | `/api/auth/forgot-password` | Public | Password reset request |

### User & Admin Routes (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Private | Fetch user profile details |
| `PUT` | `/api/users/profile` | Private | Update user profile fields |
| `PUT` | `/api/users/availability` | Donor/Admin | Toggle donor availability state |
| `GET` | `/api/users` | Admin | Retrieve directory of all users |
| `GET` | `/api/users/hospitals` | Admin | Retrieve directory of registered hospitals |
| `PUT` | `/api/users/verify-hospital/:id` | Admin | Verify or revoke hospital verification |

---

## 🔮 Phase 2 Roadmap (Future Development)

The codebase architecture has been specifically prepared for Phase 2 implementation:
- **Socket.IO Real-Time Engine**: Emergency push notifications to nearby available donors.
- **Live Location & Maps**: Geolocation tracking for nearest donors and hospitals.
- **Blood Request Matching Algorithm**: Automated compatibility matching based on distance and blood group.
- **Email & SMS Notifications**: Nodemailer / Twilio integration for instant SMS alerts.
- **Blood Inventory Management**: Full stock tracking for hospital blood banks.

---

## 📄 License
BloodConnect Platform © 2026. Built with React, Node.js, Express, and MongoDB Atlas.
