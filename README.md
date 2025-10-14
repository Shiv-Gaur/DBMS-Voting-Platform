# Voting Platform - JavaScript Edition

A secure, modern digital voting platform built with Next.js (JavaScript) frontend and Spring Boot backend, inspired by the UI design from the Vote folder but using pure JavaScript instead of TypeScript.

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14 (JavaScript), React 18, Tailwind CSS
- **Backend**: Spring Boot 3.2, Spring Security, JPA/Hibernate
- **Database**: MySQL 8.0
- **Authentication**: JWT with bcrypt password hashing
- **Real-time**: WebSocket (Socket.IO client / Spring WebSocket)
- **Deployment**: Docker & Docker Compose

### System Architecture

```
┌─────────────────┐      HTTPS/REST       ┌─────────────────┐
│                 │◄────────────────────► │                 │
│  Next.js        │                        │  Spring Boot    │
│  Frontend       │      WebSocket         │  Backend        │
│  (Port 3000)    │◄────────────────────► │  (Port 8080)    │
│                 │                        │                 │
└─────────────────┘                        └────────┬────────┘
                                                    │
                                                    │ JPA/Hibernate
                                                    │
                                           ┌────────▼────────┐
                                           │                 │
                                           │  MySQL Database │
                                           │  (Port 3306)    │
                                           │                 │
                                           └─────────────────┘
```

## 🎨 Features

### User Features
- ✅ User Registration & Login
- ✅ Secure JWT Authentication
- ✅ View Active Polls
- ✅ Cast Votes (One vote per poll per user)
- ✅ View Vote History
- ✅ Real-time Poll Results
- ✅ Responsive UI Design

### Admin Features
- ✅ Admin Dashboard
- ✅ Create Polls with Multiple Candidates
- ✅ Manage Poll Status (Pending/Active/Completed)
- ✅ View All Polls
- ✅ Real-time Results Monitoring

### Security Features
- ✅ bcrypt Password Hashing
- ✅ JWT Token Authentication
- ✅ Role-based Access Control (ADMIN/VOTER)
- ✅ CORS Configuration
- ✅ SQL Injection Prevention (JPA)
- ✅ One Vote Per User Constraint
- ✅ IP Address Logging

## 📦 Project Structure

```
voting-platform-js/
├── frontend/                 # Next.js Frontend (JavaScript)
│   ├── app/                 # App Router Pages
│   │   ├── page.js         # Home Page
│   │   ├── login/          # Login Page
│   │   ├── register/       # Registration Page
│   │   ├── vote/           # Voter Dashboard
│   │   ├── admin/          # Admin Dashboard
│   │   └── unauthorized/   # Access Denied Page
│   ├── components/         # React Components
│   │   ├── ui/            # UI Components (Button, Card, etc.)
│   │   ├── voting-card.js # Voting Component
│   │   ├── poll-form.js   # Poll Creation Form
│   │   └── results-chart.js # Results Visualization
│   ├── lib/               # Utilities & Services
│   │   ├── api.js        # API Service Layer
│   │   ├── websocket.js  # WebSocket Service
│   │   └── utils.js      # Helper Functions
│   └── package.json
│
├── backend/                # Spring Boot Backend
│   ├── src/main/java/com/votingplatform/
│   │   ├── entity/       # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Poll.java
│   │   │   ├── Candidate.java
│   │   │   └── Vote.java
│   │   ├── repository/   # JPA Repositories
│   │   ├── service/      # Business Logic
│   │   ├── controller/   # REST Controllers
│   │   ├── security/     # Security & JWT
│   │   ├── config/       # Configuration
│   │   └── dto/          # Data Transfer Objects
│   └── pom.xml
│
└── docker-compose.yml     # Docker Orchestration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.9+
- MySQL 8.0
- Docker & Docker Compose (for containerized deployment)

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
```bash
cd "C:\Users\shivg\OneDrive\Desktop\Voting Platform\voting-platform-js"
```

2. **Start all services with Docker Compose**
```bash
docker-compose up --build
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- MySQL: localhost:3306

### Option 2: Manual Setup

#### Backend Setup

1. **Configure MySQL Database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE voting_platform;
```

2. **Update application.properties** (if needed)
```properties
# backend/src/main/resources/application.properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Build and Run Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on http://localhost:8080

#### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment variables**
```bash
# Copy example env file
cp .env.example .env.local
```

3. **Run development server**
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## 🔐 Default Users

The system requires you to register users. Here's how to create an admin:

1. Register a user through the UI
2. Manually update the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Or create users programmatically via the API.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Polls
- `GET /api/polls` - Get all polls
- `GET /api/polls/active` - Get active polls
- `GET /api/polls/{id}` - Get poll by ID
- `POST /api/polls` - Create poll (Admin only)
- `PUT /api/polls/{id}` - Update poll (Admin only)
- `DELETE /api/polls/{id}` - Delete poll (Admin only)

### Candidates
- `GET /api/polls/{pollId}/candidates` - Get poll candidates
- `POST /api/polls/{pollId}/candidates` - Add candidate (Admin only)

### Votes
- `POST /api/votes` - Cast vote
- `GET /api/votes/poll/{pollId}/user` - Check if user voted
- `GET /api/votes/poll/{pollId}/results` - Get poll results
- `GET /api/votes/history` - Get user vote history

## 🔌 WebSocket Events

- Connect: `/ws`
- Subscribe: `/topic/poll/{pollId}`
- Event: `results-update` - Real-time poll results

## 🗄️ Database Schema

### Users Table
- id (PK)
- name
- email (Unique)
- password (bcrypt hashed)
- role (ADMIN/VOTER)
- created_at

### Polls Table
- id (PK)
- title
- description
- start_date
- end_date
- status (PENDING/ACTIVE/COMPLETED)
- created_by (FK → users)
- created_at

### Candidates Table
- id (PK)
- name
- description
- poll_id (FK → polls)

### Votes Table
- id (PK)
- poll_id (FK → polls)
- candidate_id (FK → candidates)
- user_id (FK → users)
- voted_at
- ip_address
- UNIQUE(poll_id, user_id)

## 🎯 Key Differences from TypeScript Version

1. **Pure JavaScript**: All `.tsx` files converted to `.js`
2. **No Type Annotations**: Removed TypeScript types
3. **PropTypes**: Can be added for runtime type checking
4. **JSDoc**: Can be used for documentation
5. **Same UI/UX**: Maintains exact UI design from Vote folder

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Authentication**: Secure token-based auth
- **CORS**: Configured for frontend origin
- **SQL Injection**: Prevented via JPA
- **XSS Protection**: React auto-escaping
- **CSRF**: Disabled for stateless API
- **One Vote Rule**: Database constraint

## 📊 Frontend Technologies

- Next.js 14 (JavaScript)
- React 18
- Tailwind CSS
- Axios (HTTP client)
- Socket.IO Client (WebSocket)
- Recharts (Visualization)
- Lucide React (Icons)
- Radix UI Components

## 🔧 Backend Technologies

- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- Spring WebSocket
- MySQL Connector
- JWT (jjwt)
- Lombok
- Maven

## 📝 Development

### Frontend Development
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Lint code
```

### Backend Development
```bash
cd backend
mvn spring-boot:run        # Run application
mvn clean install          # Build
mvn test                   # Run tests
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Database Connection Issues
- Ensure MySQL is running
- Check credentials in application.properties
- Verify database exists

### CORS Errors
- Check CORS configuration in SecurityConfig.java
- Verify frontend URL in allowed origins

## 📄 License

This project is for educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, Spring Boot, and MySQL**
