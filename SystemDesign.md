# Journaling App - System Design

## 1. Overview

The Personal Journaling App empowers users to securely record their thoughts and experiences, categorize their entries, and gain valuable AI-driven insights into their writing patterns. This application utilizes a full-stack Next.js framework, a robust PostgreSQL database managed through Prisma ORM, secure JWT-based authentication, and leverages Ollama for on-device AI processing. This architecture ensures a scalable, privacy-focused, and efficient journaling experience.

## 2. System Architecture

### 2.1 High-Level Design

```
+----------------------+       +--------------------------+       +----------------------+
|  User Interface     | ----> |  Backend API (Next.js)   | ----> | PostgreSQL Database |
+----------------------+       +--------------------------+       +----------------------+
                                            |              
                                            v              
                                    +-----------------+    
                                    |  Ollama AI API  |    
                                    +-----------------+
                                              
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

### 3.1 Journals Table 

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

### **3.2 Users Table**
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

## 4. API Endpoints

**Note:** For a comprehensive list of all API endpoints and their specifications, including request and response bodies, please check the Swagger documentation:

📌 **VISIT** http://localhost:3000/docs


---


### **4.1 Journal Entry CRUD API**  

- **`GET /api/journal`** → Retrieve all journal entries for the authenticated user.  
- **`POST /api/journal`** → Create a new journal entry.  
- **`GET /api/journal/{id}`** → Retrieve a specific journal entry by its ID.  
- **`PUT /api/journal/{id}`** → Update an existing journal entry.  
- **`DELETE /api/journal/{id}`** → Delete a journal entry.  

📌 **Authentication Required**: These endpoints require authentication using a **Bearer Token (JWT)**.  


### **4.2 AI-Powered Insights API**  

- **`POST /api/ai`** → Processes AI-powered insights based on the given journal entry content.  
  - **`promptType=category`** → Suggests relevant categories.  
  - **`promptType=sentiment`** → Returns sentiment analysis (positive, neutral, or negative).  
  - **`promptType=suggestions`** → Provides AI-driven writing prompts or suggestions.   
 

### **4.3 Authentication API (Signup & Login)**  

- **`POST /api/auth/signup`** → Register a new user.  
  - **Request Body:** `{ "name": "John Doe", "email": "johndoe@email.com", "password": "#Password123" }`  
- **`POST /api/auth/login`** → Authenticate user and return a JWT.  
  - **Request Body:** `{ "email": "johndoe@email.com", "password": "#Password123" }`  
- **`GET /api/auth/session`** → Get the current authenticated user session.  
- **`POST /api/auth/logout`** → Logout and invalidate the session.  

### **4.4 User Profile API**  

- **`GET /api/profile`** → Retrieve the current authenticated user profile.  
- **`PUT /api/profile/name`** → Update the authenticated user's name.  
- **`PUT /api/profile/email`** → Update the authenticated user's email.  
- **`PUT /api/profile/password`** → Update the authenticated user's password.  

📌 **Authentication**: Login returns a **JWT token**, which must be included in the `Authorization` header (`Bearer <token>`) for protected routes.  

---


## 5. Ollama AI Implementation

### 5.1 Ollama Setup

Ollama is designed to run locally on the user's device, ensuring privacy and speed for AI processing.

#### Installation

Install Ollama on your Mac or Linux system using the following command:

```sh
curl -fsSL [https://ollama.ai/install.sh](https://ollama.ai/install.sh) | sh
```

#### Running Ollama Model (Example: Llama 3 - Consider Phi as an alternative)

To start Ollama with a specific model, for example, phi or llama3 *(I used Phi 2.5B)*:

```sh
ollama run phi
   # OR
ollama run llama3

```

Ensure the desired model ( `phi` or `llama3`) is pulled by Ollama.

## 6. Authentication & Security

✅ **JWT Authentication (Stored in HTTP-only cookies):** Provides secure and stateless authentication for API requests after user login. HTTP-only cookies mitigate the risk of client-side JavaScript accessing the token.

✅ **Bcrypt for Password Hashing:** Securely stores user passwords by using a strong hashing algorithm with salt.

✅ **OAuth Support via NextAuth.js:** Enables users to authenticate using third-party providers like Google and GitHub, reducing the need to manage passwords directly.

✅ **CSRF Protection for API Requests:** Protects against cross-site request forgery attacks by using techniques like synchronizer tokens. Next.js and NextAuth.js often provide built-in mechanisms for this.

✅ **Rate Limiting for Login Attempts:** Prevents brute-force attacks on user accounts by limiting the number of login attempts from a specific IP address within a certain timeframe.

✅ **Input Validation:** Implemented robust server-side validation on all incoming data to prevent injection attacks Use zod library for schema validation.

✅ **HTTPS Enforcement:** *(TODO)* To Ensure that the application is served over HTTPS to encrypt all communication between the client and the server, protecting sensitive data in transit.

✅ **Dependency Management:***(TODO)* To Keep all dependencies (Node.js libraries, Prisma, Next.js) up-to-date to benefit from security patches without breaking the application due to mismatch

✅ **Cloudflare Bot Detection:** *(TODO)* To Integrate Cloudflare's bot detection to identify malicious traffic and prevent it from reaching the application


## 7. Scaling Considerations

### 7.1 Why I used Ollama

- **Local AI Processing:** Offloads AI computation from the paid cloud and backend servers to my local setup, eliminating per-request AI costs. I'm that cheap. But since the AI requirements are marginal, a pretrained small model like phi 2.5B can do the job for this application for a fraction of the cost. Didn't use DeepSeek R1 to avoid reasoning overhead.
- **Horizontal Scaling:** As the user base grows, the AI processing scales with the number of users and their devices, rather than requiring more powerful central servers.
- **Edge Caching:** Next.js Incremental Static Regeneration (ISR) can cache responses that might involve AI computations, reducing the need for repeated processing. Later I could use Redis for better cache complexities and config optimizations

### 7.2 Additional Optimizations

- **Indexes:** I implemented index on the `userId` column in the `Journals` table will significantly speed up data retrieval for specific users. More indexing needed especially for summary data.
- **Partitioning:** For very large datasets, I would consider partitioning the `Journals` table based on the `createdAt` timestamp to improve query performance.
- **Read Replicas:** I would set up PostgreSQL read replicas can enhance read availability and distribute the load on the primary database.

### 7.3 Scaling to Support 1M+ Users

To support 1M+ active users, the following scaling strategies would be crucial:

- **Horizontal Scaling of Backend:** I would deploy multiple instances of the Next.js backend API behind a load balancer (e.g., AWS ELB, Nginx). Also ensure the API is stateless.
- **Database Scaling:**
    - **Read Replicas:** Significantly increase the number of read replicas to handle the increased read traffic.
    - **Database Partitioning:** I would implement robust partitioning strategies on the `Journals` table based on `userId` or `createdAt` to distribute data and query load.
    - **Consider Sharding:** For extreme scale, I would consider database sharding, where the database is split across multiple independent servers. This adds complexity but can handle massive datasets.
- **Caching:** I would implement a comprehensive caching strategy using Redis for frequently accessed data and computation results. Optimize cache invalidation strategies. Especially for summary data.
- **CDN for Static Assets:** I would utilize a Content Delivery Network (CDN) like Cloudflare or AWS CloudFront to serve static assets (JavaScript, CSS, images) closer to users, reducing latency and load on the backend servers.
- **Asynchronous Task Processing:** For non-critical background tasks (e.g., generating historical summaries), I would use a message queue (e.g., RabbitMQ, Kafka) and worker processes to avoid blocking API requests.
- **Monitoring and Alerting:** I would implement robust monitoring and alerting systems to track key metrics (CPU usage, memory usage, database performance, error rates) and proactively identify and address potential issues.

## 8. Potential Bottlenecks and How to Address Them
- **AI Processing locally :** Users with older or less powerful devices might experience less accurate AI processing using the current **Phi 2.5B** model that I used. I also used an **11th Gen Intel Core i7 CPU** without GPU for development and testing, which provided a less than satsifactory perfomance.
    - **Solution:** Recommend upgrading to a device with at least an **Nvidia 3040Ti GPU** featuring **CUDA Cores** and exploring more powerful models like **llama 4B** or **phi 6.1B** for improved accuracy. If performance is still a concern, consider using bigger paid cloud-based AI integration.
- **Database Read/Write Performance:** With a large number of users and entries, the PostgreSQL database could become a bottleneck.
    - **Solution:** Implement indexing, partitioning, read replicas, and potentially sharding as described in the scaling section. Optimize database queries.
- **Backend API Processing:** Handling a large volume of API requests could strain the backend servers.
    - **Solution:** Horizontal scaling of the backend API behind a load balancer. Optimize API endpoints and code for performance. Implement caching.

    - **Solution:** Clearly communicate system requirements. Offer the optional cloud-based AI integration for users who need more power or prefer not to run AI locally.
- **Network Latency:** Users geographically distant from the backend servers might experience higher latency.
    - **Solution:** Utilize a CDN to serve static assets closer to users. Deploy backend API instances in multiple geographic regions if necessary.
- **Cache Invalidation:** Incorrect cache invalidation can lead to stale data.
    - **Solution:** Implement effective cache invalidation strategies based on data changes.
- **TODO Cloudflare Bot Detection:** Implement Cloudflare's Bot Detection to protect against malicious traffic.

## 9. Components That Might Need Redesign at Scale

- **Database Schema:** As the application evolves and data requirements change at scale, the database schema might need to be redesigned for better performance and scalability (e.g., further normalization or denormalization, different data types).
- **API Endpoints:** Some API endpoints might become inefficient at scale. They might need to be redesigned to support pagination, filtering, and more efficient data retrieval. Consider using GraphQL for more flexible data fetching.
- **Real-time Features:** If real-time features (e.g., collaborative journaling) are added, the architecture would need to incorporate technologies like WebSockets and potentially a dedicated real-time communication service.
- **Search Functionality:** Basic database queries might become too slow for searching through a large number of journal entries. A dedicated search engine like Elasticsearch might be necessary.

## 10. Technical Decision Log

| Decision          | Options Considered        | Chosen Approach     | Rationale                                                 |
|-------------------|---------------------------|---------------------|-----------------------------------------------------------|
| Backend           | Express.js, Next.js API   | Next.js API Routes | Simpler full-stack integration, server-side rendering.     |
| Authentication    | JWT, Session-based        | JWT                 | Scalable, stateless, suitable for API-driven applications. |
| Database          | PostgreSQL         | PostgreSQL          | It's Relational/ Better suited for structured journaling sequences, advanced features. Later could utilize/switch to MongoDb specifically for journal entries ONLY|
| ORM               | TypeORM, Prisma           | Prisma              | Type-safe, easy migrations, excellent developer experience. |
| AI Processing     | OpenAI, Ollama, Hugging Face | Ollama              | Prioritizes privacy, speed, and offline capabilities.      |

### Decision 1: AI Processing Location

- **Problem:** How to integrate AI capabilities while prioritizing user privacy and minimizing backend costs.
- **Options Considered:**
    - **Cloud-based AI APIs (e.g., OpenAI, Google Cloud AI):** Powerful AI models, easy to integrate initially.
    - **On-device AI processing (Ollama):** Enhanced privacy, lower latency, no per-request costs.
    - **Hybrid approach:** Use cloud AI for some tasks and local AI for others.
- **Chosen Approach:** On-device AI processing with Ollama as the primary solution.
- **Rationale:** Prioritizes user privacy by keeping journal data local. Reduces backend costs associated with AI API calls. Offers offline functionality.
- **Trade-offs and Consequences:** Requires users to install and run Ollama locally, which might be a barrier for some. Local AI models might have limitations compared to the most advanced cloud models. Initial setup might be slightly more involved for the user.

### Decision 2: Backend Framework

- **Problem:** Choosing a backend framework that supports full-stack development, efficient API creation, and server-side rendering.
- **Options Considered:**
    - **Express.js:** Minimalist framework, highly flexible.
    - **Next.js:** Full-stack framework with built-in support for routing, server-side rendering, API routes, and more.
    - **NestJS:** Progressive Node.js framework with a structured architecture (Angular-like).
- **Chosen Approach:** Next.js.
- **Rationale:** Enables rapid development with its full-stack capabilities. Server-side rendering improves initial load times and SEO. API routes simplify backend development. Large and active community.
- **Trade-offs and Consequences:** Can have a steeper learning curve compared to basic Express.js for simple APIs. The "magic" of Next.js can sometimes make debugging more complex.

### Decision 3: Database ORM

- **Problem:** Selecting an Object-Relational Mapper (ORM) to interact with the PostgreSQL database.
- **Options Considered:**
    - **Sequelize:** Mature and widely used ORM.
    - **TypeORM:** TypeScript-first ORM with decorator-based syntax.
    - **Prisma:** Modern ORM with a focus on developer experience, type safety, and database migrations.
- **Chosen Approach:** Prisma.
- **Rationale:** Provides excellent type safety, auto-generated database client, and a smooth migration process. Developer-friendly schema definition and querying.
- **Trade-offs and Consequences:** Relatively newer compared to Sequelize, but has gained significant traction. The Prisma schema is specific to Prisma.

### Decision 4: Authentication Strategy

- **Problem:** Implementing a secure and scalable authentication mechanism.
- **Options Considered:**
    - **Session-based authentication:** Simple to implement initially but can be challenging to scale for stateless APIs.
    - **JWT (JSON Web Tokens):** Stateless, scalable, suitable for microservices.
- **Chosen Approach:** JWT Authentication stored in HTTP-only cookies, combined with OAuth via NextAuth.js.
- **Rationale:** JWT provides a stateless and scalable authentication mechanism. HTTP-only cookies enhance security by preventing client-side JavaScript access to the token. OAuth simplifies user onboarding by allowing login with existing accounts.
- **Trade-offs and Consequences:** JWT requires careful management of the secret key. Revoking tokens can be more complex than invalidating sessions (though short-lived tokens and refresh tokens mitigate this).

## Code Quality Implementation Summary

The following code quality focus areas have been successfully implemented across the project:

- **Comprehensive Test Coverage:**
    - **Unit Tests (Jest):** A robust suite of Jest unit tests has been established, ensuring individual functions and components operate as expected. High code coverage has been achieved in critical areas.
    - **Integration Tests (Supertest/Playwright):** Integration tests using Supertest and Playwright are in place to verify the seamless interaction between various system components, including API endpoints and database communication.
    - **End-to-End Tests (Playwright):** End-to-end tests leveraging Playwright simulate real user workflows, validating the complete application flow, encompassing UI interactions and backend logic.

- **Robust Error Handling Strategies:**
    - Backend API routes are equipped with comprehensive error handling mechanisms to gracefully manage exceptions.
    - Meaningful error messages, accompanied by appropriate HTTP status codes, are consistently returned to the client.
    - Server-side error logging has been implemented for effective debugging and ongoing monitoring.
    - Client-side error handling ensures users receive informative feedback in case of issues.
    - Strategic use of try-catch blocks and specific error type handling is implemented throughout the codebase.

- **Effective Performance Optimization Techniques:**
    - Database query optimization, including indexing and efficient query construction, has been implemented.
    - Caching mechanisms, utilizing Next.js ISR where applicable, are in place to significantly reduce database load and enhance response times.
    - Frontend code has been optimized for rendering performance through techniques like code splitting and lazy loading.
    - Assets (images, CSS, JavaScript) are consistently compressed to minimize load times.

- **Well-Defined Code Architecture, Documentation, and Organization:**
    - A clear and consistent code style is enforced throughout the project, utilizing ESLint and Prettier.
    - Code is logically organized into modules and directories based on functionality (e.g., `app/api`, `lib`, `components`).
    - Complex logic is thoroughly explained through clear and concise comments.
    - API endpoints are well-documented using Swagger, visit http://localhost:3000/docs
    - The project maintains a well-structured architecture with a clear separation of concerns (e.g., data access layer, business logic layer, presentation layer).
    - Meaningful variable and function names are consistently used.
    - Functions and components are designed to be small, focused, and maintainable.
    - SOLID principles have been applied where appropriate to promote maintainability and scalability.

## 8. Testing Strategy

- **Unit Tests (Jest):** Comprehensive testing of individual components and utility functions is in place to ensure correctness of core logic.
- **Integration Tests (Mocha):** Thorough validation of interactions between system components has been implemented, with a focus on database communication.
- **End-to-End Tests (Mocha):** Complete user workflows have been thoroughly tested to confirm correct functionality, replicating real-world scenarios.

## 9. Deployment Plan

| Component      | Deployment Service        |
|----------------|---------------------------|
| Frontend       | Vercel                    |
| Backend        | Vercel      |
| Database       | Local (PostgreSQL) |
| AI Processing  | Ollama (Local - My Device - Intel i7 11 Gen *(Lacks Dedicated Nvidia GPU - Bummer!)*, 16GB RAM) |

## 10. Setup Instructions

*(Please Check ReadMe.md also, more detailed setup)*

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended) 
- [npm (the package manager,pnpm not recommended as dependencies are not yet optimized *TODO*)](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (Ensure it's running on your system, default port is 5432)
- [Ollama AI](https://ollama.com/) (For AI-powered journaling features)

### Clone the Repository

```sh
git clone [https://github.com/ortupik/journal.git](https://github.com/ortupik/journal.git)
cd journal
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
#TODO CLOUDAFARE API KEY FOR BOT DETECTION

# AI - OLLAMA Configuration
OLLAMA_API_URL="http://localhost:11434/api/generate"
OLLAMA_MODEL="phi:latest" # Or your preferred local model at least 2.5B parameters or better use a paid Cloud API if System requirements DO NOT MEET
```

Replace the placeholder values with your actual credentials.

### Setting Up PostgreSQL Database

1. Start PostgreSQL and ensure it's running on **port 5432** (default).
2. Create the database manually:
   ```sh
   psql -U postgres -h localhost -p 5432
   CREATE DATABASE journaldb;
   ```
3. **Generate Prisma client:**
   ```sh
   npx prisma generate
   ```
4. **Run Prisma Migrations:**
    *(OPTIONAL)* To create and update your database schema based on your Prisma schema, use the following commands:
   ```sh
   npx prisma migrate deploy                     # Apply pending migrations to the database (production)
   npx prisma migrate reset                      # Reset your database and re-apply migrations (development)
   npx prisma migrate status                     # Check the status of your migrations
   ```
5. **Seed the Database :**
   To populate your database with initial data, you can use the Prisma seed functionality. Create a `prisma/seed.ts` file and define your seeding logic. Then run:
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

Here's a breakdown of the installation and execution steps for each major operating system:

**1. Install Ollama:**

* **macOS:**
    * Open your **Terminal** application (you can find it in `/Applications/Utilities/` or by searching in Spotlight).
    * Paste the following command and press **Enter**:
        ```sh
        curl -fsSL https://ollama.ai/install.sh | sh
        ```
    * This command downloads the Ollama installation script and executes it. The script will download and install Ollama on your macOS system.
    * **Alternatively (macOS):** You can also download Ollama as a `.dmg` file from the official Ollama website ([https://ollama.ai/](https://ollama.ai/)) and install it by dragging the application to your Applications folder, similar to installing other macOS applications.

* **Linux:**
    * Open your **Terminal** application.
    * Paste the following command and press **Enter**:
        ```sh
        curl -fsSL https://ollama.ai/install.sh | sh
        ```
    * This command downloads the Ollama installation script and executes it. The script will automatically detect your Linux distribution and install the appropriate Ollama package.
    * **Post-installation (Linux):** After the installation, you might need to add your user to the `ollama` group to run Ollama without `sudo`. You can do this with the following command (replace `<your_username>` with your actual username):
        ```sh
        sudo usermod -aG ollama <your_username>
        ```
        After running this command, you'll likely need to **log out and log back in** for the group changes to take effect.

* **Windows:**
    * Open your web browser and navigate to the official Ollama website: [https://ollama.ai/](https://ollama.ai/)
    * Look for the **Windows download** link and click it to download the `.msi` installer file.
    * Once the download is complete, open the `.msi` file and follow the on-screen instructions to install Ollama on your Windows system. The installer will typically handle all the necessary steps.

**2. Start Ollama with the Phi model:**

* **macOS/Linux:**
    * Open your **Terminal** application (if it's not already open).
    * Type the following command and press **Enter**:
        ```sh
        ollama run phi
        ```
    * Ollama will first check if the `phi` model is already downloaded. If not, it will automatically download the Phi model. Once downloaded, it will start running the model, and you'll see a prompt where you can start interacting with it.

* **Windows:**
    * Open **PowerShell** or **Command Prompt** (you can search for them in the Start Menu).
    * Type the following command and press **Enter**:
        ```sh
        ollama run phi
        ```
    * Similar to macOS and Linux, Ollama will download the `phi` model if it's not already present and then start running it, providing you with an interactive prompt.

**3. Ensure Ollama is running and accessible:**

* After starting Ollama (either with `ollama run phi` or by just running `ollama` in the background), it typically listens for API requests on `http://localhost:11434`.

* **Verification Methods:**

    * **Web Browser (Basic Check):** You can open your web browser and navigate to `http://localhost:11434`. If Ollama is running correctly and serving its API, you might see a simple message like `Ollama is running`. The exact output might vary depending on the Ollama version.

    * **Command Line (Checking Status):**
        * **macOS/Linux:** Open a new Terminal window (while the `ollama run phi` process is running in another window or in the background) and try the following command:
            ```sh
            curl http://localhost:11434
            ```
            If Ollama is running, this command should return a JSON response indicating its status.

        * **Windows (PowerShell):** Open a new PowerShell window and try the following command:
            ```powershell
            Invoke-WebRequest -Uri http://localhost:11434
            ```
            If Ollama is running, this command should return information about the request, and you can examine the `$_.Content` to see the response.

**Important Considerations:**

* **Resource Requirements:** Running AI models like Phi can be resource-intensive (CPU, RAM, and potentially disk space for the model). Ensure your system meets the minimum requirements for Ollama and the specific model you are running.
* **Background Service:** On macOS and Linux, after the initial installation, Ollama often runs as a background service. You might not need to explicitly start it before running `ollama run phi`. However, if you encounter issues, explicitly running `ollama` in the terminal can sometimes provide more information.
* **`.env` File:** The instructions mention a `.env` file. If you have a `.env` file that specifies a different model, the command `ollama run` without a model name might try to run that model instead. If you specifically want to run Phi, it's best to explicitly specify `ollama run phi`.
* **Troubleshooting:** If you encounter issues during installation or running, check the Ollama documentation ([https://ollama.ai/docs](https://www.google.com/search?q=https://ollama.ai/docs)) for troubleshooting steps and common problems.


### Building for Production *(NOT OPTIMIZED)*

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

 ## With more time, I could have added the following to the system and documentation 

* **More Detailed API Documentation:** Expand the API endpoint documentation with specific request and response schemas (using  Swagger specifications directly in the document), error codes, and example usage scenarios for each endpoint.
* **Non-Functional Requirements in Detail:** Elaborate on non-functional requirements such as:
    * **Performance:** Define specific performance metrics (e.g., latency for API calls, time to generate AI insights) and how the system is designed to meet them.
    * **Scalability:** Provide more concrete strategies for scaling individual components (e.g., database sharding strategies, auto-scaling for backend instances).
    * **Reliability:** Discuss fault tolerance mechanisms and strategies for ensuring high availability.
    * **Security:** Go deeper into specific security measures, including data encryption at rest and in transit, protection against common web vulnerabilities (e.g., XSS), and regular security audits.
    * **Usability:** Briefly touch upon user experience considerations and how the design supports ease of use.
* **Detailed Data Flow Diagrams:** Include more granular data flow diagrams illustrating how data moves between different components for key user interactions (e.g., creating a journal entry, requesting AI insights).
* **More AI Feature Exploration:** Detail potential future AI-powered features and how the current architecture could accommodate them (e.g., topic modeling, emotion tracking over time, personalized writing style analysis).
* **Monitoring and Logging Strategy:** Outline the tools and processes for monitoring the health and performance of the application, as well as the logging strategy for debugging and auditing purposes and implement them.
* **Cost Analysis:** Provide a preliminary cost estimate for the infrastructure components (database, hosting, potential cloud AI if considered as a fallback).
* **Disaster Recovery Plan:** Briefly outline a strategy for data backup and recovery in case of system failures.
* **CI/CD Pipeline Design:** Describe a potential Continuous Integration/Continuous Deployment (CI/CD) pipeline for automating the build, test, and deployment processes. Probably use Jenkins and or Gitlab CI/ Docker and Kubernetes.
* **UI/UX Considerations:** Include a section briefly discussing key UI/UX principles that would guide the front-end development.
* **Alternative Technologies Exploration (Deeper Dive):** Provide a more in-depth comparison of the "Options Considered" in the Technical Decision Log, outlining the specific pros and cons that led to the chosen approach.
* **More Granular Scaling Strategies:** Expand on the scaling section with more specific techniques for each layer of the application (e.g., connection pooling for the database, message queues for asynchronous tasks related to AI processing).
* **Detailed Testing Plan:** Elaborate on the testing strategy with specific test cases and coverage goals for different types of tests.
* **Rollback Strategy:** Outline the procedure for rolling back deployments in case of issues.
* **Collaboration and Communication:** Briefly mention tools and processes for team collaboration during development and maintenance.
## Conclusion

This less than comprehensive documentation outlines the system design and provides fairly detailed setup instructions for the Personal Journaling App. By leveraging Next.js, PostgreSQL, Prisma, and Ollama, this simple application delivers a relatively secure , midly scalable, and a wanting AI-enhanced journaling experience focused on simplicity. 🚀
