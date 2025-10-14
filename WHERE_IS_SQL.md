# 📍 Where is the SQL? - Quick Answer

## Short Answer
**There are NO traditional SQL files** in this project. The database schema is automatically created by **Hibernate/JPA** from Java Entity classes.

---

## 🗂️ SQL-Related Files Created for You

I've created these documentation files to help you:

| File | Location | Description |
|------|----------|-------------|
| **SQL_DOCUMENTATION.md** | Root directory | **START HERE** - Complete SQL overview |
| **DATABASE.md** | Root directory | Full database documentation |
| **schema.sql** | `backend/src/main/resources/` | Reference schema (for documentation) |
| **exported_schema.sql** | Root directory | Actual current database structure |

---

## 🔍 Where the Database Schema Comes From

### Source: Java Entity Classes
Location: `backend/src/main/java/com/votingplatform/entity/`

```
entity/
├── User.java       → Creates USERS table
├── Poll.java       → Creates POLLS table
├── Candidate.java  → Creates CANDIDATES table
└── Vote.java       → Creates VOTES table
```

### How It Works
1. **Spring Boot starts** → Reads Entity classes
2. **Hibernate analyzes** → Java annotations (@Entity, @Table, @Column)
3. **SQL generated** → CREATE TABLE statements
4. **Tables created** → In MySQL database automatically

### Configuration
File: `backend/src/main/resources/application.properties`
```properties
spring.jpa.hibernate.ddl-auto=update  # Auto-creates tables
spring.jpa.show-sql=true              # Shows SQL in logs
```

---

## 📊 Current Database Structure

### Tables (4 total)

1. **USERS** (4 rows currently)
   - Stores admin and voter accounts
   - Fields: id, name, email, password (BCrypt), role, created_at

2. **POLLS** (0 rows currently)
   - Stores voting polls/elections
   - Fields: id, title, description, start_date, end_date, status, created_by

3. **CANDIDATES** (0 rows currently)
   - Stores candidates for each poll
   - Fields: id, name, description, poll_id

4. **VOTES** (0 rows currently)
   - Stores individual votes
   - Fields: id, poll_id, candidate_id, user_id, voted_at, ip_address
   - Constraint: One vote per user per poll

---

## 🔧 How to View/Export SQL

### View in Database
```powershell
# Connect to MySQL
docker exec -it voting-mysql mysql -u root -proot voting_platform

# Show tables
SHOW TABLES;

# Describe table structure
DESCRIBE users;

# View data
SELECT * FROM users;
```

### Export Schema to File
```powershell
# Schema only (no data)
docker exec voting-mysql sh -c "mysqldump -u root -proot --no-data voting_platform" > my_schema.sql

# Schema + Data
docker exec voting-mysql sh -c "mysqldump -u root -proot voting_platform" > full_backup.sql
```

---

## 📋 Current Database Data

### Users Table (Default Users)
```
ID | Name          | Email                | Role  | Created At
---+---------------+----------------------+-------+------------------------
1  | Admin User    | admin@voting.com     | ADMIN | 2025-10-14 17:01:01
2  | John Doe      | voter1@voting.com    | VOTER | 2025-10-14 17:01:01
3  | Jane Smith    | voter2@voting.com    | VOTER | 2025-10-14 17:01:02
4  | Alex Johnson  | candidate@voting.com | VOTER | 2025-10-14 17:01:02
```

**Login Credentials**: See `CREDENTIALS.md`

---

## 🎯 Summary

### Traditional SQL-Based Projects
```
project/
└── src/
    └── main/
        └── resources/
            └── db/
                ├── schema.sql     ← Creates tables
                └── data.sql       ← Inserts data
```

### This Project (JPA/Hibernate)
```
project/
└── src/
    └── main/
        └── java/
            └── entity/
                ├── User.java      ← Defines USERS table
                ├── Poll.java      ← Defines POLLS table
                ├── Candidate.java ← Defines CANDIDATES table
                └── Vote.java      ← Defines VOTES table
```

**Key Difference**: Schema is defined in **Java code**, not SQL files!

---

## 📚 Read These Files

1. **SQL_DOCUMENTATION.md** ← Complete SQL guide
2. **DATABASE.md** ← Database documentation
3. **exported_schema.sql** ← Actual MySQL schema

---

## ✅ Quick Commands Reference

```powershell
# Connect to database
docker exec -it voting-mysql mysql -u root -proot voting_platform

# Export schema
docker exec voting-mysql sh -c "mysqldump -u root -proot --no-data voting_platform" > schema.sql

# View users
docker exec voting-mysql mysql -u root -proot voting_platform -e "SELECT * FROM users;"

# View all tables
docker exec voting-mysql mysql -u root -proot voting_platform -e "SHOW TABLES;"
```

---

**Need more help?** Check the detailed documentation in **SQL_DOCUMENTATION.md** 📖
