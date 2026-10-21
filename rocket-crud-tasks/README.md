# Tasks API (Node.js 22)

Task management API with full CRUD, search filters, completion toggle, and CSV bulk import.

## Requirements

- Node.js 22+
- npm
- PostgreSQL (or Docker Compose)

## Environment

Create a `.env` file with:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tasks_db
NODE_ENV=development
```

For tests, use `.env.test`:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/tasks_test_db
NODE_ENV=test
```

## Run with Docker Compose

```bash
docker compose up --build
```

API will be available at `http://localhost:3333`.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the API:

```bash
npm run dev
```

## Health and metrics

- `GET /health`: API and database health status.
- `GET /metrics`: basic in-memory request counters.

## Migrations

Create a migration pair:

```bash
npm run migration:create -- add_due_date_to_tasks
```

Apply migrations:

```bash
npm run migration:up
```

Rollback latest migration:

```bash
npm run migration:down
```

## Routes

- `POST /tasks`
  - Body: `{ "title": "Task title", "description": "Task description" }`
- `GET /tasks`
  - Optional query params: `title`, `description`
- `PUT /tasks/:id`
  - Body: `{ "title": "New title" }` or `{ "description": "New description" }`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/complete`

## CSV import

1. Ensure the API is running.
2. Use the default `tasks.csv` file or pass a custom CSV path.

```bash
npm run import-csv
# or
node src/scripts/import-csv.js ./my-tasks.csv
```

Optional environment variables:

- `API_BASE_URL` (default: `http://localhost:3333`)
- `IMPORT_CONCURRENCY` (default: `5`)

CSV format:

```csv
title,description
Task 01,Task 01 description
Task 02,Task 02 description
```

## Tests

```bash
npm test
npm run test:coverage
npm run test:integration:pg
```

To run PostgreSQL integration tests, start the test database:

```bash
docker compose up -d postgres_test
```
