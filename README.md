# FinFlow

FinFlow is a full-stack personal finance web application that goes beyond a basic expense tracker. It is designed with a modern "fintech calm" UI/UX and offers powerful features like shared expenses (pod splitting), real-time balances via WebSocket, savings goals with visual tracking, bill & subscription radar, and automated spending insights.

## Project Structure

This is a monorepo containing:
- `/backend`: Java 21, Spring Boot 3.x, Spring Web, Data JPA, Security (JWT), PostgreSQL, WebSocket, Bean Validation.
- `/frontend`: React 18+, TypeScript, Vite, TailwindCSS, React Query, Zustand.
- `/legacy`: The legacy Java console application used as a reference implementation.

## Local Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Java 21+ & Maven (for direct backend development)

### Environment Variables
*(Create a `.env` file in the root, and/or within backend/frontend as they are configured in future phases)*
```env
# Database
POSTGRES_USER=finflow_user
POSTGRES_PASSWORD=finflow_password
POSTGRES_DB=finflow_db

# JWT Auth
JWT_SECRET=your_super_secret_key_here
```

### Running Locally with Docker Compose

To spin up the local PostgreSQL database (and optionally PGAdmin):

```bash
docker-compose up -d postgres pgadmin
```
- PGAdmin will be available at `http://localhost:5050`
- Postgres will be exposed on port `5432`

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running the Backend
```bash
cd backend
mvn clean spring-boot:run
```

## Running Tests

**Backend:**
```bash
cd backend
mvn test
```

## Deployment
Production builds will be containerized. To deploy the application using the future `docker-compose.prod.yml`, you will only need to configure the appropriate environment variables for your host (Render, AWS, Railway, etc.).
