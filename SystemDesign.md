# ** Journal App - System Design Document**


# **1. Overview**  
The **Personal Journaling App** enables users to securely log journal entries, categorize them, and gain insights into their writing habits. The app leverages **Next.js (full-stack)**, **PostgreSQL (via Prisma ORM)**, and **JWT-based authentication** to provide a scalable and performant journaling experience.

---

# **2. System Architecture**  

### **2.1 High-Level Design**  
```
+----------------------+       +--------------------------+       +----------------------+
|  User Interface     | ----> |  Backend API (Next.js)   | ----> | PostgreSQL Database |
+----------------------+       +--------------------------+       +----------------------+
```

### **2.2 Components**
| Component      | Technology Used  | Purpose |
|---------------|------------------|---------|
| **Frontend**  | Next.js (React, TypeScript) | User interface for writing, viewing, and analyzing journal entries |
| **Backend**   | Next.js API Routes (Node.js) | Handles authentication, journal CRUD, analytics, AI |
| **Database**  | PostgreSQL (via Prisma ORM) | Stores users, journals, and session data |
| **Auth**      | JWT (JSON Web Token) | Secure authentication and user management |
| **AI Features (Optional)** | NLP (Sentiment Analysis) | Smart journal suggestions and sentiment tracking |

---

# **3. Data Model Design**  
*(Derived from Prisma Schema)*

### **3.1 Users Table**
| Column         | Type       | Constraints |
|---------------|-----------|-------------|
| id            | UUID      | Primary Key, Auto-Generated |
| name          | String?   | Nullable |
| email         | String    | Unique, Required |
| emailVerified | DateTime? | Nullable |
| image         | String?   | Nullable (Profile Picture) |
| password      | String    | Required (Hashed) |
| createdAt     | DateTime  | Default: `now()` |
| updatedAt     | DateTime  | Auto-updated |
| accounts      | Relation  | One-to-Many with `Account` |
| journals      | Relation  | One-to-Many with `Journal` |

### **3.2 Journals Table**
| Column        | Type      | Constraints |
|--------------|----------|-------------|
| id           | UUID     | Primary Key, Auto-Generated |
| title        | String   | Required |
| content      | Text     | Required |
| category     | String   | ENUM (e.g., Work, Personal, Travel) |
| userId       | UUID     | Foreign Key to `User` |
| createdAt    | DateTime | Default: `now()` |
| updatedAt    | DateTime | Auto-updated |
| summary      | String?  | Auto-generated summary (optional) |
| sentiment    | String?  | AI-powered sentiment analysis |
| suggestions  | String?  | AI-powered writing suggestions |

### **3.3 Account Table** *(For OAuth login)*
| Column            | Type     | Constraints |
|------------------|---------|-------------|
| id              | UUID    | Primary Key |
| userId          | UUID    | Foreign Key to `User` |
| provider        | String  | OAuth Provider (e.g., Google, GitHub) |
| providerAccountId | String  | Unique ID from provider |
| access_token    | String? | OAuth Access Token |
| refresh_token   | String? | OAuth Refresh Token |

### **3.4 Sessions Table**
| Column        | Type      | Constraints |
|--------------|----------|-------------|
| id           | UUID     | Primary Key |
| sessionToken | String   | Unique |
| userId       | UUID     | Foreign Key to `User` |
| expires      | DateTime | Expiration Date |

---

# **4. API Endpoints**
## **4.1 Authentication API**
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Authenticate user
- `POST /api/auth/logout` → Invalidate session

## **4.2 Journal Entries API**
- `GET /api/journals` → Get all user journals
- `POST /api/journals` → Create new journal
- `PUT /api/journals/:id` → Edit journal
- `DELETE /api/journals/:id` → Delete journal

## **4.3 Insights API (AI/Analytics)**
- `GET /api/summary/category-distribution` → Pie chart for categories
- `GET /api/summary/word-trends` → Word frequency analysis
- `GET /api/summary/heatmap` → Writing consistency heatmap
- `GET /api/journals/:id/sentiment` → Analyze sentiment of an entry

---

# **5. Authentication & Security**
✅ **JWT Authentication** (Stored in HTTP-only cookies)  
✅ **Bcrypt for Password Hashing**  
✅ **OAuth Support via NextAuth.js**  
✅ **CSRF Protection for API Requests**  
✅ **Rate Limiting for Login Attempts**  

---

# **6. Scaling Considerations**
### **6.1 Database Optimizations**
- **Indexes**: `userId` indexed in `Journal` table for fast retrieval
- **Partitioning**: Large tables can be partitioned by `createdAt`
- **Read Replicas**: PostgreSQL replication for high availability

### **6.2 Caching Strategy**
- **Redis**: Cache expensive queries (e.g., word frequency analysis)
- **Edge Caching**: Next.js ISR for pre-rendering data

### **6.3 Load Balancing**
- **Stateless API**: Enables easy horizontal scaling
- **API Rate Limiting**: Prevents abuse of AI-generated summaries

---

# **7. AI/ML Enhancements (Optional)**
- **Sentiment Analysis**: NLP model detects positive/negative mood
- **Auto-Categorization**: AI suggests categories based on content
- **Smart Suggestions**: Writing prompt recommendations

---

# **8. Technical Decision Log**
| Decision | Options Considered | Chosen Approach | Rationale |
|----------|-------------------|----------------|-----------|
| **Backend** | Express.js, Next.js API | Next.js API Routes | Simpler full-stack integration |
| **Auth** | JWT, Session-based | JWT | Scalable, stateless |
| **DB** | MySQL, PostgreSQL | PostgreSQL | Better for structured journaling data |
| **ORM** | TypeORM, Prisma | Prisma | Type-safe, easy migrations |
| **AI** | OpenAI, Custom NLP | OpenAI API | Quick integration, high accuracy |

---

# **9. Testing Strategy**
- **Unit Tests** (Jest) → Test core API logic  
- **Integration Tests** (Supertest) → Ensure database integrity  
- **E2E Tests** (Playwright) → Verify user flow  

---

# **10. Deployment Plan**
| Component  | Deployment Service |
|------------|--------------------|
| **Frontend** | **Vercel** |
| **Backend** | **Vercel / AWS Lambda** |
| **Database** | **Supabase / AWS RDS (PostgreSQL)** |

---

# **11. API Documentation**
*(To be included as OpenAPI/Swagger docs in GitHub repo)*

---

# **12. Setup Instructions**
*(Please Check ReadMe.md for detailed instructions)*

1. **Clone Repo**:  
   ```sh
   git clone https://github.com/ortupik/journal.git
   cd journal
   ```
2. **Install Dependencies**:  
   ```sh
   npm install
   ```
3. **Set Up Database**:  
   ```sh
   cp .env.example .env
   # Update DATABASE_URL in .env
   npx prisma migrate dev
   ```
4. **Start Development Server**:  
   ```sh
   npm run dev
   ```
5. **Run Tests**:  
   ```sh
   npm run test
   ```

---