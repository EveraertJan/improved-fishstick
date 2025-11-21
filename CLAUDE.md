# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Student reasearch documentation system

## Architecture

The project uses a microservices architecture with the following components:

- **api**: Node.js/Express REST API service that handles CRUD operations for students, attendance, and users
- **db**: PostgreSQL database for persistent storage
- **frontend**: React frontend for the student

All services communicate through a Docker bridge network named `backend`.

## Development Commands

### Starting the application

```bash
# Start all services with Docker Compose
docker compose up -d --build

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### API Development

```bash
cd api

# Development mode with hot reload
npm start

# Production mode
npm run prod

# Run database migrations
npm run migrate

# Run tests
npm run test-ci          # CI mode
npm run test-watch       # Watch mode
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Development mode with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database

The project uses Knex.js for database migrations and queries. Database configuration is in `api/src/db/knexfile.js`.

**Schema Tables:**
- `users`: first_name, last_name, password, uuid
- `students`: first_name, last_name, class, year, uuid
- `research_documents`: student_id, title, description, research_question, methodology, findings, conclusion, status, uuid
- `research_notes`: research_document_id, content, note_type, uuid
- `research_resources`: research_document_id, title, url, resource_type, notes, uuid

### API Endpoints

**Students:**
- GET `/students` - List all students
- POST `/students` - Create student (requires: uuid, first_name, last_name, class, year)

**Research Documents:**
- GET `/research-documents` - List all research documents
- GET `/research-documents/:id` - Get specific document
- POST `/research-documents` - Create document (requires: uuid, student_id, title)
- PUT `/research-documents/:id` - Update document
- DELETE `/research-documents/:id` - Delete document

**Research Notes:**
- GET `/research-notes?research_document_id=:id` - Get notes for a document
- POST `/research-notes` - Create note (requires: uuid, research_document_id, content, note_type)
- DELETE `/research-notes/:id` - Delete note

**Research Resources:**
- GET `/research-resources?research_document_id=:id` - Get resources for a document
- POST `/research-resources` - Create resource (requires: uuid, research_document_id, title, resource_type)
- DELETE `/research-resources/:id` - Delete resource

### Environment Configuration

Create a `.env` file from `.env.template` with required database credentials:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`

### Code Standards

The project follows conventions outlined in `STANDARDS.md`:
- Express routing with separate route handlers
- Middleware-based architecture
- Request validation using `checkBodyFields` helper
- Knex.js for database operations
- Middleware for authentication, JWT tokens

### Contributing

Follow the guidelines in `CONTRIBUTING_GUIDELINES.md`:
- Commit conventions: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `style:`
- Breaking changes must include `BREAKING CHANGE:` in commit body
- All features require tests
- Run tests before submitting PRs

## Common Patterns

**Body Validation:**
```javascript
const { checkBodyFields } = require("./helpers/bodyHelpers");
if(checkBodyFields(req.body, ["field1", "field2"])) {
  // Process valid request
}
```

**Database Queries:**
```javascript
// Select
pg.select("*").table("students").then((data) => { ... })

// Insert
pg.insert(req.body).table("students").returning("*").then((data) => { ... })
```

## Service Access

- Frontend (React): http://localhost:3001
- API: http://localhost:3000
- Database: localhost:5432
