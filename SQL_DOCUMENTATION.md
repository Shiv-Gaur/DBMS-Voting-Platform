# SQL Database Information - Voting Platform

## 📍 Where is the SQL?

**Answer**: This project **does NOT use traditional SQL files** for database schema creation. Instead, it uses **JPA/Hibernate ORM** which automatically generates the database schema from Java Entity classes.

## 🔍 How Database Schema is Created

### Automatic Schema Generation
The database tables are created automatically by Hibernate when the application starts, based on:

1. **JPA Entity Classes** (Java code):
   - Location: `backend/src/main/java/com/votingplatform/entity/`
   - Files: `User.java`, `Poll.java`, `Candidate.java`, `Vote.java`

2. **Configuration** in `application.properties`:
   ```properties
   spring.jpa.hibernate.ddl-auto=update  # Auto-creates/updates tables
   spring.jpa.show-sql=true              # Shows SQL in logs
   ```

### Where to Find SQL-Related Files

| File | Location | Purpose |
|------|----------|---------|
| **Entity Classes** | `backend/src/main/java/com/votingplatform/entity/*.java` | Defines database structure in Java |
| **Reference Schema** | `backend/src/main/resources/schema.sql` | Documentation (not used by app) |
| **Exported Schema** | `exported_schema.sql` (root) | Actual current database structure |
| **Database Docs** | `DATABASE.md` (root) | Complete documentation |

---

## 📊 Current Database Schema (Exported from MySQL)

### Table: USERS
```sql
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','VOTER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB;
```

### Table: POLLS
```sql
CREATE TABLE `polls` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `end_date` datetime(6) NOT NULL,
  `start_date` datetime(6) NOT NULL,
  `status` enum('PENDING','ACTIVE','COMPLETED') NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs2iay0nvudl3tl0a33ji0pxyn` (`created_by`),
  CONSTRAINT `FKs2iay0nvudl3tl0a33ji0pxyn` 
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
```

### Table: CANDIDATES
```sql
CREATE TABLE `candidates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `name` varchar(255) NOT NULL,
  `poll_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4uitivl7iv8wt3sr0q9ybyvla` (`poll_id`),
  CONSTRAINT `FK4uitivl7iv8wt3sr0q9ybyvla` 
    FOREIGN KEY (`poll_id`) REFERENCES `polls` (`id`)
) ENGINE=InnoDB;
```

### Table: VOTES
```sql
CREATE TABLE `votes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(255) DEFAULT NULL,
  `voted_at` datetime(6) NOT NULL,
  `candidate_id` bigint NOT NULL,
  `poll_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8um9h2wxsdjrgx3rjjwvny676` (`poll_id`,`user_id`),
  KEY `FKgr0htccc82fco8rhtkxcuct4g` (`candidate_id`),
  KEY `FKli4uj3ic2vypf5pialchj925e` (`user_id`),
  CONSTRAINT `FK7trt3uyihr4g13hva9d31puxg` 
    FOREIGN KEY (`poll_id`) REFERENCES `polls` (`id`),
  CONSTRAINT `FKgr0htccc82fco8rhtkxcuct4g` 
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`),
  CONSTRAINT `FKli4uj3ic2vypf5pialchj925e` 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
```

---

## 🗂️ Database Structure Overview

```
voting_platform (Database)
│
├── users (4 rows)
│   ├── id (BIGINT, PK, AUTO_INCREMENT)
│   ├── name (VARCHAR)
│   ├── email (VARCHAR, UNIQUE)
│   ├── password (VARCHAR, BCrypt hashed)
│   ├── role (ENUM: ADMIN, VOTER)
│   └── created_at (DATETIME)
│
├── polls
│   ├── id (BIGINT, PK, AUTO_INCREMENT)
│   ├── title (VARCHAR)
│   ├── description (TEXT)
│   ├── start_date (DATETIME)
│   ├── end_date (DATETIME)
│   ├── status (ENUM: PENDING, ACTIVE, COMPLETED)
│   ├── created_by (BIGINT, FK -> users.id)
│   └── created_at (DATETIME)
│
├── candidates
│   ├── id (BIGINT, PK, AUTO_INCREMENT)
│   ├── name (VARCHAR)
│   ├── description (TEXT)
│   └── poll_id (BIGINT, FK -> polls.id)
│
└── votes
    ├── id (BIGINT, PK, AUTO_INCREMENT)
    ├── poll_id (BIGINT, FK -> polls.id)
    ├── candidate_id (BIGINT, FK -> candidates.id)
    ├── user_id (BIGINT, FK -> users.id)
    ├── voted_at (DATETIME)
    ├── ip_address (VARCHAR)
    └── UNIQUE(poll_id, user_id)  # One vote per user per poll
```

---

## 🔧 How to Access the Database

### Method 1: MySQL Command Line (via Docker)
```powershell
# Connect to MySQL
docker exec -it voting-mysql mysql -u root -proot voting_platform

# Inside MySQL prompt:
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users;
```

### Method 2: Export Schema to File
```powershell
# Export schema only (no data)
docker exec voting-mysql sh -c "mysqldump -u root -proot --no-data voting_platform" > schema.sql

# Export schema with data
docker exec voting-mysql sh -c "mysqldump -u root -proot voting_platform" > full_backup.sql
```

### Method 3: Using MySQL Workbench
```
Host: localhost
Port: 3306
Username: root
Password: root
Database: voting_platform
```

---

## 📝 Useful SQL Queries

### View All Users
```sql
SELECT id, name, email, role, created_at FROM users;
```

### View All Polls
```sql
SELECT 
    p.id,
    p.title,
    p.status,
    p.start_date,
    p.end_date,
    u.name as created_by_name
FROM polls p
LEFT JOIN users u ON p.created_by = u.id;
```

### Get Vote Count for Each Candidate in a Poll
```sql
SELECT 
    c.name as candidate_name,
    COUNT(v.id) as vote_count
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
WHERE c.poll_id = 1
GROUP BY c.id, c.name
ORDER BY vote_count DESC;
```

### Check User's Voting History
```sql
SELECT 
    p.title as poll_title,
    c.name as voted_for,
    v.voted_at
FROM votes v
JOIN polls p ON v.poll_id = p.id
JOIN candidates c ON v.candidate_id = c.id
WHERE v.user_id = 1
ORDER BY v.voted_at DESC;
```

### Check if User Already Voted in a Poll
```sql
SELECT COUNT(*) as has_voted
FROM votes
WHERE poll_id = 1 AND user_id = 2;
```

---

## 🔄 If You Want to Use SQL Files Instead

### Step 1: Export Current Schema
```powershell
docker exec voting-mysql sh -c "mysqldump -u root -proot --no-data voting_platform" > schema.sql
```

### Step 2: Update application.properties
```properties
# Change from:
spring.jpa.hibernate.ddl-auto=update

# To (validates against existing schema, doesn't create tables):
spring.jpa.hibernate.ddl-auto=validate
```

### Step 3: Create SQL Script Directory
```
backend/src/main/resources/
└── db/
    └── migration/
        ├── V1__create_users_table.sql
        ├── V2__create_polls_table.sql
        ├── V3__create_candidates_table.sql
        └── V4__create_votes_table.sql
```

### Step 4: Add Flyway or Liquibase
```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

---

## 📚 Summary

| Question | Answer |
|----------|--------|
| **Where is the SQL?** | No SQL files - Schema auto-generated by JPA/Hibernate |
| **How are tables created?** | From Java Entity classes in `backend/src/.../entity/` |
| **Can I see the SQL?** | Yes, see `exported_schema.sql` or check logs (show-sql=true) |
| **Can I use SQL files?** | Yes, but requires switching to Flyway/Liquibase |
| **Where is the data?** | In MySQL Docker container, database: `voting_platform` |
| **How to access DB?** | `docker exec -it voting-mysql mysql -u root -proot voting_platform` |

---

## 📖 Related Documentation Files

- **DATABASE.md** - Complete database documentation
- **backend/src/main/resources/schema.sql** - Reference SQL schema
- **exported_schema.sql** - Actual current database structure
- **CREDENTIALS.md** - Default user credentials
- **README.md** - Project setup and usage

---

## 🎯 Key Takeaway

**This is a modern Spring Boot application** that uses:
- ✅ **JPA/Hibernate ORM** for database access
- ✅ **Automatic schema generation** from Entity classes
- ✅ **No manual SQL scripts** needed for normal operation
- ✅ **Type-safe** database operations through Java code

The Entity classes ARE the database schema definition! 🚀
