# Project Setup Documentation

## Prerequisites
Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/) (Ensure it's running on your system)
- [Ollama AI](https://ollama.com/) (For AI-powered journaling features)

## Clone the Repository
```sh
git clone https://github.com/ortupi/journal.git
cd journal.git
```

## Install Dependencies
```sh
npm install
```

## Setup Environment Variables
Create a `.env` file in the root directory and add the following configuration:
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/journaldb?schema=public"
SHADOW_DATABASE_URL="postgresql://postgres:postgres@localhost:5433/journaldb?schema=public"

# NextAuth Configurations (OAuth Authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
NEXTAUTH_SECRET="your-random-secret-key"

# AI - OLLAMA Configuration
OLLAMA_API_URL="http://localhost:11434/api/generate"
OLLAMA_MODEL="phi:latest"
```
Replace the placeholder values with your actual credentials.

## Setting Up PostgreSQL Database
1. Start PostgreSQL and ensure it's running on **port 5433**.
2. Create the database manually:
   ```sh
   psql -U postgres -h localhost -p 5433
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

## Running the Application
To start the development server, run:
```sh
npm run dev
```
The application will be available at `http://localhost:3000/`

## Running Ollama AI (Phi Model)
1. Install Ollama:
   ```sh
   curl -fsSL https://ollama.ai/install.sh | sh
   ```
2. Start Ollama with the **Phi** model:
   ```sh
   ollama run phi
   ```
3. Ensure Ollama is running at `http://localhost:11434`

## Building for Production
To build the application for production:
```sh
npm run build
```
To start the production server:
```sh
npm start
```

## Linting and Formatting
Ensure code quality by running:
```sh
npm run lint
npm run format
```

## Deployment
For deploying the application, follow these steps:
1. **Set up environment variables** on your server.
2. **Run database migrations** in production:
   ```sh
   npx prisma migrate deploy
   ```
3. **Start the application**:
   ```sh
   npm run dev or
   npm run build && npm start
   ```


