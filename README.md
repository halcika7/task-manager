# Task Management Application

A full-stack application built with Next.js, NestJS, and PostgreSQL.

## Prerequisites

- Docker and Docker Compose
- Node.js 20.x (for local development)
- pnpm (for local development)

## Project Structure

```
.
├── app/                # Next.js frontend application
├── api/                # NestJS backend application
├── docker-compose.yml  # Docker compose configuration
└── README.md          # This file
```

## Quick Start with Docker (Development)

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Start the development environment:

   ```bash
   docker compose up
   ```

   This will start:

   - Next.js frontend on http://localhost:3000
   - NestJS backend on http://localhost:5000
   - PostgreSQL database on port 5432

3. To stop the services:

   ```bash
   docker compose down
   ```

   To remove volumes as well:

   ```bash
   docker compose down -v
   ```

## Production Deployment

For production deployment of the Next.js application:

1. Build the production image:

   ```bash
   cd app
   docker build -t nextjs-app .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 nextjs-app
   ```

## Local Development (Without Docker)

### Frontend (Next.js)

1. Navigate to the frontend directory:

   ```bash
   cd app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

### Backend (NestJS)

1. Navigate to the backend directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm start:dev
   ```

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb
```

## Database

The PostgreSQL database is configured with the following default credentials:

- User: postgres
- Password: postgres
- Database: taskdb
- Port: 5432

## Additional Commands

Clean up Docker resources:

```bash
# Remove all containers
docker compose down

# Remove all containers and volumes
docker compose down -v

# Remove all unused images
docker system prune
```
