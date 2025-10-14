# Voting Platform - Login Credentials

## 🔐 Default User Credentials

The system has been initialized with the following default users for testing:

### 👨‍💼 Admin User
**Role:** Administrator
- **Email:** `admin@voting.com`
- **Password:** `Admin@123`
- **Full Name:** Admin User
- **Permissions:** 
  - Create, manage, and delete polls
  - View all results
  - Access admin dashboard
  - Manage candidates

### 🗳️ Voter 1
**Role:** Voter
- **Email:** `voter1@voting.com`
- **Password:** `Voter@123`
- **Full Name:** John Doe
- **Permissions:**
  - View active polls
  - Cast votes (one vote per poll)
  - View own vote history
  - View real-time results

### 🗳️ Voter 2
**Role:** Voter
- **Email:** `voter2@voting.com`
- **Password:** `Voter@123`
- **Full Name:** Jane Smith
- **Permissions:**
  - View active polls
  - Cast votes (one vote per poll)
  - View own vote history
  - View real-time results

### 👤 Candidate User
**Role:** Voter (can also be added as a candidate in polls)
- **Email:** `candidate@voting.com`
- **Password:** `Candidate@123`
- **Full Name:** Alex Johnson
- **Permissions:**
  - Same as regular voters
  - Can be added as a candidate in any poll by admin

## 📊 Database Schema

Based on the schema diagram, the database contains the following tables:

### **USERS**
- `id` (BIGINT, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, unique)
- `password` (VARCHAR)
- `role` (VARCHAR) - ENUM: ADMIN, VOTER
- `created_at` (DATETIME)

### **POLLS**
- `id` (BIGINT, PK)
- `title` (VARCHAR)
- `description` (TEXT)
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `status` (ENUM) - PENDING, ACTIVE, COMPLETED
- `require_public` (BOOLEAN)
- `created_by` (BIGINT, FK → USERS)
- `created_at` (DATETIME)

### **CANDIDATES**
- `id` (BIGINT, PK)
- `poll_id` (BIGINT, FK → POLLS)
- `name` (VARCHAR)
- `bio` (TEXT)
- `party` (VARCHAR)
- `photo_path` (VARCHAR)
- `active` (BOOLEAN)

### **VOTES**
- `id` (BIGINT, PK)
- `poll_id` (BIGINT, FK → POLLS)
- `candidate_id` (BIGINT, FK → CANDIDATES)
- `ballot_approval` (VARCHAR)
- `ballot_hash` (VARCHAR)
- `cast_at` (DATETIME)
- `anonymous` (BOOLEAN)
- `status` (VARCHAR)

### **VOTER_REGISTRATIONS**
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK → USERS)
- `approved_at` (DATETIME)
- `verification_method` (JSON)

### **AUDIT_LOGS**
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK → USERS)
- `action` (VARCHAR)
- `details` (JSON)
- `logged_at` (DATETIME)

### **FRAUD_ALERTS**
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK → USERS)
- `alert_type` (VARCHAR)
- `evidence` (JSON)
- `resolved` (BOOLEAN)
- `created_at` (DATETIME)

### **OTP_LOGS**
- `id` (BIGINT, PK)
- `user_id` (BIGINT, FK → USERS)
- `otp_hash` (VARCHAR)
- `purpose` (VARCHAR)
- `used` (BOOLEAN)
- `created_at` (DATETIME)

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **MySQL Database:** localhost:3306

## 🚀 Technology Stack

- **Backend:** Spring Boot 3.2.0 with Java 21 LTS
- **Frontend:** Next.js 14 (JavaScript)
- **Database:** MySQL 8.0
- **Authentication:** JWT with bcrypt password hashing
- **Real-time:** WebSocket for live poll results

## 📝 Notes

1. All passwords are encrypted using bcrypt before being stored in the database
2. The system uses JWT (JSON Web Tokens) for authentication
3. Each user can only vote once per poll (enforced at database level)
4. Admin users have access to create and manage polls
5. The database schema supports additional features like fraud detection, audit logs, and OTP verification

## 🔒 Security Features

- Password encryption with bcrypt
- JWT-based authentication
- One vote per user per poll constraint
- IP address logging
- Audit trail for all actions
- Fraud detection system
