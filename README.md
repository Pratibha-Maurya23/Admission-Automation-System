# 🎓 Admission Automation System

> A modern, secure, and fully automated College Admission Portal designed to streamline the student registration, verification, and fee payment process.

🌐 **Live Website:** [https://admission-automation-system.vercel.app/](https://admission-automation-system.vercel.app/)

---

## ⚡ Key Features

### 💻 Student Portal & Interface
- **Modern Dashboard:** Clean, intuitive, and responsive dashboard showing student profile, qualification details, and status.
- **Interactive Admission Form:** Multi-step form for personal information, educational qualifications, document references, and academic gap details.
- **Mock Payment Portal:** Integrated admission fee checkout interface.
- **Instant PDF Receipts:** Dynamic, server-side generated PDF fee receipts for successfully paid students.

### 🔑 Authentication & Security
- **Double Login System:**
  - **Standard Login:** Access via unique system-generated Admission Number and Password.
  - **OTP Login (Passwordless):** Secure login option sending a 6-digit OTP to the student's registered phone number.
- **Password Self-Service:** Ability for students to securely reset their login password.
- **Session Persistence:** Protected backend routes and session store backed by MongoDB to keep users securely logged in.
- **Encrypted Secrets:** All passwords and OTPs are safely hashed using `bcrypt` before database storage.

### 📡 Automated Notifications & Integrations
- **Twilio Integration:** Automated WhatsApp notifications sent to students upon:
  - Successful Admission (delivering their auto-generated Admission Number & Password).
  - Requesting a verification OTP.
- **Console Fallback:** Built-in development mode that falls back to console logging if Twilio API keys are missing.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-based interactive UI with fast hot-reloading |
| **Styling** | TailwindCSS | Modern, fully responsive utility-first CSS styling |
| **Backend** | Express 5 (Node.js) | Light, fast, and scalable REST API |
| **Database** | MongoDB (Mongoose) | Document-oriented database for storing student profiles and credentials |
| **Session Store**| Connect-Mongo | Session persistence across server restarts |
| **PDF Generation**| PDFKit | Dynamic backend PDF generator for invoices/receipts |
| **Communication** | Twilio API | Integrated messaging for OTP and WhatsApp notifications |

---

## 📁 Project Structure

```
Admission-Automation-System/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Header, Footer, etc.
│   │   ├── pages/          # Login, OTP, Forms, Dashboard, Payment
│   │   ├── App.jsx         # App router and entry point
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                # Backend API server
    ├── middleware/         # Session authentication guards
    ├── models/             # Mongoose database models (Student schema)
    ├── routes/             # Authentication & business API endpoints
    ├── server.js           # Server startup script
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas cloud cluster)
* Twilio Account (Optional, for WhatsApp/SMS notifications)

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone https://github.com/Pratibha-Maurya23/Admission-Automation-System.git
cd Admission-Automation-System
```

#### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=8000
   MONGO_URL=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   FRONTEND_URL=http://localhost:5173

   # Optional: Twilio Config
   TWILIO_SID=your_twilio_account_sid
   TWILIO_AUTH=your_twilio_auth_token
   TWILIO_PHONE=your_twilio_phone_number_or_whatsapp_sender
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

#### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`.

---

## 📡 API Endpoints

### Authentication & Profiles
* `POST /admission` - Registers a new student, generates admission credentials, and sends notification.
* `POST /login` - Standard login with Admission No. and password.
* `POST /forgot-password` - Resets a student's password.
* `POST /logout` - Standard logout and session destruction.
* `GET /me` - Fetches authenticated student profile context.

### Passwordless Login (OTP)
* `POST /send-otp` - Generates, hashes, and sends an OTP via WhatsApp.
* `POST /verify-otp` - Verifies the OTP code and creates a session.

### Payments & Invoicing
* `POST /payment` - Records mock fee payment transaction.
* `GET /receipt/:studentId` - Generates and streams PDF admission receipt.

---

## 🔒 Security Practices
* **Hashing:** Secure `bcrypt` implementation with a salt round of `10` for credentials and verification codes.
* **Sessions:** HTTP-only cookies securely handled via `express-session`, protected under custom security flags (`secure: true`, `sameSite: 'none'`) in production.
* **Database Sanitization:** Structured inputs parsed strictly through Mongoose schemas to avoid injection vectors.

---

## 📄 License
This project is licensed under the ISC License.