# Database Schema Documentation

## Overview
This project uses **JPA/Hibernate ORM** for automatic database schema generation. The database schema is **NOT** created from SQL files, but is automatically generated from Java Entity classes.

## How It Works

### Automatic Schema Generation
The schema is created automatically by Hibernate based on these settings in `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- `ddl-auto=update` - Hibernate automatically creates/updates tables based on Entity classes
- `show-sql=true` - Logs the SQL statements being executed

### Entity Classes Location
The database schema is defined in Java Entity classes located at:
```
backend/src/main/java/com/votingplatform/entity/
├── User.java       -> users table
├── Poll.java       -> polls table
├── Candidate.java  -> candidates table
└── Vote.java       -> votes table
```

## Database Tables

### 1. USERS Table
**Entity**: `User.java`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Login email |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| role | VARCHAR(50) | NOT NULL | ADMIN or VOTER |
| created_at | TIMESTAMP | NOT NULL | Account creation timestamp |

**Indexes**:
- Primary Key: `id`
- Unique: `email`

---

### 2. POLLS Table
**Entity**: `Poll.java`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Poll ID |
| title | VARCHAR(255) | NOT NULL | Poll title |
| description | TEXT | NULL | Poll description |
| start_date | TIMESTAMP | NOT NULL | Poll start time |
| end_date | TIMESTAMP | NOT NULL | Poll end time |
| status | VARCHAR(50) | NOT NULL | PENDING, ACTIVE, COMPLETED |
| created_by | BIGINT | FOREIGN KEY | Reference to users.id |
| created_at | TIMESTAMP | NOT NULL | Poll creation timestamp |

**Foreign Keys**:
- `created_by` -> `users.id`

**Indexes**:
- Primary Key: `id`
- Index: `created_by`, `status`, `start_date`, `end_date`

---

### 3. CANDIDATES Table
**Entity**: `Candidate.java`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Candidate ID |
| name | VARCHAR(255) | NOT NULL | Candidate name |
| description | TEXT | NULL | Candidate description |
| poll_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to polls.id |

**Foreign Keys**:
- `poll_id` -> `polls.id` (CASCADE DELETE)

**Indexes**:
- Primary Key: `id`
- Index: `poll_id`

---

### 4. VOTES Table
**Entity**: `Vote.java`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Vote ID |
| poll_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to polls.id |
| candidate_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to candidates.id |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | Reference to users.id |
| voted_at | TIMESTAMP | NOT NULL | Vote timestamp |
| ip_address | VARCHAR(45) | NULL | Voter's IP address |

**Foreign Keys**:
- `poll_id` -> `polls.id` (CASCADE DELETE)
- `candidate_id` -> `candidates.id` (CASCADE DELETE)
- `user_id` -> `users.id` (CASCADE DELETE)

**Unique Constraint**:
- `UNIQUE(poll_id, user_id)` - One vote per user per poll

**Indexes**:
- Primary Key: `id`
- Index: `poll_id`, `candidate_id`, `user_id`, `voted_at`

---

## Entity Relationships (ERD)

```
┌─────────────┐
│   USERS     │
│ (id, email, │
│  name, role)│
└──────┬──────┘
       │ 1
       │
       │ creates
       │
       │ *
┌──────┴──────┐      * ┌──────────────┐
│   POLLS     │────────│  CANDIDATES  │
│ (id, title, │   has  │ (id, name,   │
│  start/end) │        │  poll_id)    │
└──────┬──────┘        └──────┬───────┘
       │ 1                    │ 1
       │                      │
       │ contains             │ for
       │                      │
       │ *                    │ *
       └──────┬───────────────┘
              │
         ┌────┴─────┐
         │  VOTES   │
         │ (id,     │
         │  user_id,│
         │  poll_id,│
         │candidate)│
         └──────────┘
```

---

## How to Export Current Database Schema

### Option 1: Using MySQL Workbench
1. Connect to: `localhost:3306`
2. Database: `voting_platform`
3. Go to: Server → Data Export
4. Select `voting_platform` database
5. Export to SQL file

### Option 2: Using MySQL Command Line
```bash
# Access MySQL container
docker exec -it voting-mysql bash

# Inside container, dump schema only
mysqldump -u root -proot --no-data voting_platform > /tmp/schema.sql

# Dump schema and data
mysqldump -u root -proot voting_platform > /tmp/full_backup.sql

# Exit and copy to host
exit
docker cp voting-mysql:/tmp/schema.sql ./schema.sql
```

### Option 3: Using PowerShell (Direct)
```powershell
# Export schema only
docker exec voting-mysql mysqldump -u root -proot --no-data voting_platform > schema_export.sql

# Export schema and data
docker exec voting-mysql mysqldump -u root -proot voting_platform > full_export.sql
```

---

## Viewing Current Database Schema

### Connect to MySQL
```powershell
# Connect to MySQL container
docker exec -it voting-mysql mysql -u root -proot voting_platform
```

### Useful MySQL Commands
```sql
-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;
DESCRIBE polls;
DESCRIBE candidates;
DESCRIBE votes;

-- Show create table statement
SHOW CREATE TABLE users;
SHOW CREATE TABLE polls;
SHOW CREATE TABLE candidates;
SHOW CREATE TABLE votes;

-- View all users
SELECT id, name, email, role FROM users;

-- View all polls
SELECT id, title, status, start_date, end_date FROM polls;

-- View vote counts by poll
SELECT 
    p.title, 
    c.name, 
    COUNT(v.id) as votes 
FROM votes v
JOIN polls p ON v.poll_id = p.id
JOIN candidates c ON v.candidate_id = c.id
GROUP BY p.id, c.id;
```

---

## Default Data

### Initial Users (Created by DataInitializer.java)

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@voting.com | Admin@123 | ADMIN | Admin User |
| voter1@voting.com | Voter@123 | VOTER | Voter One |
| voter2@voting.com | Voter@123 | VOTER | Voter Two |
| candidate@voting.com | Candidate@123 | VOTER | Candidate User |

**Note**: Passwords are stored as BCrypt hashes in the database.

---

## Database Configuration

### Connection Details (from docker-compose.yml)
```yaml
Database: voting_platform
Host: localhost (or mysql in Docker network)
Port: 3306
Username: root
Password: root
```

### JDBC URL (from application.properties)
```
jdbc:mysql://localhost:3306/voting_platform?
  createDatabaseIfNotExist=true&
  useSSL=false&
  allowPublicKeyRetrieval=true&
  serverTimezone=UTC
```

---

## Migration to Manual SQL Scripts (Optional)

If you prefer to use manual SQL scripts instead of Hibernate auto-generation:

1. **Export current schema**:
   ```bash
   docker exec voting-mysql mysqldump -u root -proot --no-data voting_platform > schema.sql
   ```

2. **Update application.properties**:
   ```properties
   # Change from:
   spring.jpa.hibernate.ddl-auto=update
   
   # To:
   spring.jpa.hibernate.ddl-auto=validate
   ```

3. **Create migration scripts** using tools like:
   - Flyway
   - Liquibase
   - Custom SQL scripts in `src/main/resources/db/migration/`

---

## Backup and Restore

### Backup
```bash
# Full backup with data
docker exec voting-mysql mysqldump -u root -proot voting_platform > backup_$(date +%Y%m%d).sql

# Schema only
docker exec voting-mysql mysqldump -u root -proot --no-data voting_platform > schema.sql
```

### Restore
```bash
# Restore from backup
docker exec -i voting-mysql mysql -u root -proot voting_platform < backup.sql
```

---

## References

- **JPA Entities**: `backend/src/main/java/com/votingplatform/entity/`
- **Application Config**: `backend/src/main/resources/application.properties`
- **Data Initializer**: `backend/src/main/java/com/votingplatform/config/DataInitializer.java`
- **Schema SQL (Reference)**: `backend/src/main/resources/schema.sql`
