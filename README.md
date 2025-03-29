# Personal Journaling App - System Design and Project Setup

## 1. Overview

The Personal Journaling App empowers users to securely record their thoughts and experiences, categorize their entries, and gain valuable AI-driven insights into their writing patterns. This application utilizes a full-stack Next.js framework, a robust PostgreSQL database managed through Prisma ORM, secure JWT-based authentication, and leverages Ollama for on-device AI processing. This architecture ensures a scalable, privacy-focused, and efficient journaling experience.

## 2. System Architecture

### 2.1 High-Level Design

```
+----------------------+       +--------------------------+       +----------------------+
|  User Interface     | ----> |  Backend API (Next.js)   | ----> | PostgreSQL Database |
+----------------------+       +--------------------------+       +----------------------+
                                  |              |
                                  v              v
                       +-----------------+    +----------------+
                       |  Ollama AI API  |    |  (Optional)   |
                       +-----------------+    |  OpenAI API    |
                                              +----------------+
```

### 2.2 Why Ollama for AI Processing?

✅ **On-Device AI Processing:** Eliminates the need for cloud-based AI APIs, significantly reducing latency and operational costs.

✅ **Privacy-Focused:** Ensures that sensitive journal data remains within the user's local environment, enhancing data security and privacy.

✅ **Offline Capability:** Enables AI-powered features to function even without an active internet connection.

✅ **Fast Response Time:** Local execution of AI models by Ollama minimizes API call delays, providing quicker insights.

✅ **Open-Source & Customizable:** Offers the flexibility to easily fine-tune AI models to better suit individual journaling preferences and needs.

### 2.3 Comparison of AI Model Choices

| AI Model              | Pros                                                    | Cons                                                |
|-----------------------|---------------------------------------------------------|-----------------------------------------------------|
| Ollama (local LLMs)   | Private, fast, offline                                  | Requires initial device setup and resource usage      |
| OpenAI (GPT-4 API)    | Powerful, no local setup required                       | Costs per request, potential privacy considerations |
| Hugging Face Inference API | Wide range of models, free tier available              | Can be slower than local inference for some models    |

## 3. Data Model Design

(Derived from Prisma Schema with AI Enhancements)

### 3.1 Journals Table (Updated for AI)

| Column      | Type         | Constraints                     | AI-Powered?          | Description                                       |
|-------------|--------------|---------------------------------|----------------------|---------------------------------------------------|
| id          | UUID         | Primary Key, Auto-Generated     | ❌                    | Unique identifier for each journal entry           |
| title       | String       | Required                        | ❌                    | Title of the journal entry                        |
| contentText | String       | Required                        | ❌                    | Main content of the journal entry                 |
| category    | String       | ENUM (e.g., Work, Personal, Travel) | ✅ (Auto-categorized) | Category of the journal entry                     |
| userId      | UUID         | Foreign Key to User             | ❌                    | Identifier of the user who created the entry      |
| createdAt   | DateTime     | Default: now()                  | ❌                    | Timestamp when the entry was created              |
| updatedAt   | DateTime     | Auto-updated                    | ❌                    | Timestamp when the entry was last updated         |
| summary     | String?      |                                 | ✅ (AI-generated)     | Concise AI-generated summary of the entry        |
| sentiment   | String?      | "Positive", "Neutral", "Negative" | ✅                    | AI-analyzed sentiment of the entry               |
| suggestions | String?      |                                 | ✅                    | AI-driven writing prompts or suggestions related to the entry |

## 4. API Endpoints

### 4.1 AI-Powered Insights API

- `GET /api/ai/categorize`: Suggests relevant categories for a given journal entry content.
- `GET /api/ai/sentiment`: Returns the sentiment analysis (positive, neutral, or negative) of a journal entry.
- `GET /api/ai/suggestions`: Provides AI-driven writing prompts or suggestions based on the journal entry content.
- `GET /api/summary/word-trends`: Analyzes word frequency across journal entries.
- `GET /api/summary/heatmap`: Generates a visual heatmap representing writing consistency over time.

## 5. Ollama AI Implementation

### 5.1 Ollama Setup

Ollama is designed to run locally on the user's device, ensuring privacy and speed for AI processing.

#### Installation

Install Ollama on your Mac or Linux system using the following command:

```sh
curl -fsSL [https://ollama.ai/install.sh](https://ollama.ai/install.sh) | sh
```

#### Running Ollama Model (Example: Llama 3 - Consider Phi as an alternative)

To start Ollama with a specific model, for example, Llama 3 (or Phi as mentioned in the setup):

```sh
ollama run llama3
# OR
ollama run phi
```

Ensure the desired model (`phi` preferably) is pulled by Ollama.

#### How you can Integrate Ollama API in Next.js Backend

**Note:** Ensure your local `OLLAMA_API_URL` and `OLLAMA_MODEL` are correctly configured in your `.env` file. I used opensource Microsoft phi

## 6. Authentication & Security

✅ **JWT Authentication (Stored in HTTP-only cookies):** Provides secure and stateless authentication.

✅ **Bcrypt for Password Hashing:** Ensures secure storage of user passwords.

✅ **OAuth Support via NextAuth.js:** Enables users to log in using their existing Google or GitHub accounts.

✅ **CSRF Protection for API Requests:** Mitigates cross-site request forgery attacks.

✅ **Rate Limiting for Login Attempts:** Protects against brute-force login attempts.

## 7. Scaling Considerations

### 7.1 Why Ollama is Scalable

- **Local AI Processing:** Offloads AI computation from the backend servers to individual user devices, eliminating per-request AI costs.
- **Horizontal Scaling:** As the user base grows, the AI processing scales with the number of users and their devices, rather than requiring more powerful central servers.
- **Edge Caching:** Next.js Incremental Static Regeneration (ISR) can cache responses that might involve AI computations, reducing the need for repeated processing.

### 7.2 Additional Optimizations

- **Indexes:** Implementing an index on the `userId` column in the `Journals` table will significantly speed up data retrieval for specific users.
- **Partitioning:** For very large datasets, consider partitioning the `Journals` table based on the `createdAt` timestamp to improve query performance.
- **Read Replicas:** Setting up PostgreSQL read replicas can enhance read availability and distribute the load on the primary database.

## 8. AI/ML Enhancements (Ollama vs. OpenAI)

| Feature              | Ollama (Local AI)             | OpenAI (GPT-4)                  |
|-----------------------|-------------------------------|---------------------------------|
| Sentiment Analysis    | ✅ Fast, Private              | ✅ More accurate                 |
| Auto-Categorization   | ✅ Fast                       | ✅ More refined                 |
| Writing Suggestions   | ✅ No API calls                | ✅ More varied and creative prompts |
| Cost                  | ✅ Free (after initial setup) | ❌ Pay-per-request                |
| Privacy               | ✅ High                      | ❌ Potential privacy concerns     |
| Offline Functionality | ✅ Yes                       | ❌ Requires internet connection   |

## 9. Technical Decision Log

| Decision          | Options Considered        | Chosen Approach     | Rationale                                                 |
|-------------------|---------------------------|---------------------|-----------------------------------------------------------|
| Backend           | Express.js, Next.js API   | Next.js API Routes | Simpler full-stack integration, server-side rendering.     |
| Authentication    | JWT, Session-based        | JWT                 | Scalable, stateless, suitable for API-driven applications. |
| Database          | MySQL, PostgreSQL         | PostgreSQL          | Better suited for structured journaling data, advanced features. |
| ORM               | TypeORM, Prisma           | Prisma              | Type-safe, easy migrations, excellent developer experience. |
| AI Processing     | OpenAI, Ollama, Hugging Face | Ollama              | Prioritizes privacy, speed, and offline capabilities.      |

## 10. Testing Strategy

- **Unit Tests (Jest):** Focus on testing the core logic of individual components and utility functions.
- **Integration Tests (Supertest):** Verify the correct interaction between different parts of the system, especially database interactions.
- **End-to-End Tests (Playwright):** Ensure the entire user flow works as expected, simulating real user scenarios.

## 11. Deployment Plan

| Component      | Deployment Service        |
|----------------|---------------------------|
| Frontend       | Vercel                    |
| Backend        | Vercel / AWS Lambda       |
| Database       | Supabase / AWS RDS (PostgreSQL) |
| AI Processing  | Ollama (Local - User's Device) |

## 12. Setup Instructions

*(Please Check SystemDesign.md for detailed system documentation)*

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/) (Ensure it's running on your system, default port is 5432)
- [Ollama AI](https://ollama.com/) (For AI-powered journaling features)

### Clone the Repository

```sh
git clone [https://github.com/your-repo/journaling-app.git](https://github.com/your-repo/journaling-app.git) # Replace with your actual repository URL
cd journaling-app
```

### Install Dependencies

```sh
npm install
```

### Setup Environment Variables

Create a `.env` file in the root directory and add the following configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/journaldb?schema=public"
SHADOW_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/journaldb?schema=public"

# NextAuth Configurations (OAuth Authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
NEXTAUTH_SECRET="your-random-secret-key"

# AI - OLLAMA Configuration
OLLAMA_API_URL="http://localhost:11434/api/generate"
OLLAMA_MODEL="phi:latest" # Or your preferred local model
```

Replace the placeholder values with your actual credentials.

### Setting Up PostgreSQL Database

1. Start PostgreSQL and ensure it's running on **port 5432** (default).
2. Create the database manually:
   ```sh
   psql -U postgres -h localhost -p 5432
   CREATE DATABASE journaldb;
   ```
3. Run Prisma migrations:
   ```sh
   npx prisma migrate dev --name init
   ```
4. Generate Prisma client:
   ```sh
   npx prisma generate
   ```
5. Seed the database (if applicable):
   ```sh
   npx prisma db seed
   ```
6. **Default Login Credentials**:
   After seeding the database, you can log in using the following default credentials (if seeding is implemented):
   - **Email**: `johndoe@email.com`
   - **Password**: `#Password123`

### Running the Application

To start the development server, run:

```sh
npm run dev
```

The application will be available at `http://localhost:3000/`

### Running Ollama AI (Phi Model)

1. Install Ollama:
   ```sh
   curl -fsSL [https://ollama.ai/install.sh](https://ollama.ai/install.sh) | sh
   ```
2. Start Ollama with the **Phi** model (or the model specified in your `.env`):
   ```sh
   ollama run phi
   ```
3. Ensure Ollama is running and accessible at `http://localhost:11434`.

### Building for Production

To build the application for production:

```sh
npm run build
```

To start the production server:

```sh
npm start
```

### Linting and Formatting

Ensure code quality by running:

```sh
npm run lint
npm run format
```

### Deployment

For deploying the application, follow these steps:

1. **Set up environment variables** on your server environment.
2. **Run database migrations** in production:
   ```sh
   npx prisma migrate deploy
   ```
3. **Build and start the application**:
   ```sh
   npm run build && npm start
   ```

## Conclusion

This comprehensive documentation outlines the system design and provides detailed setup instructions for the Personal Journaling App. By leveraging Next.js, PostgreSQL, Prisma, and Ollama, this application delivers a secure, scalable, and AI-enhanced journaling experience focused on user privacy. 🚀
```