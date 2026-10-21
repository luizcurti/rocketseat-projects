# FindAFriend API

REST API for pet adoption, with ORG registration and authentication.

## Implemented Requirements

- ORG registration with mandatory address and WhatsApp
- ORG login
- Pet registration linked to an authenticated ORG
- List pets by city (required)
- Optional filters by characteristics
- Pet details with ORG WhatsApp
- Layered architecture with use cases and repositories
- Unit tests with Vitest
- Prisma ORM with versioned migrations
- Docker Compose with Postgres

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Start Postgres:

```bash
docker compose up -d
```

3. Run migrations:

```bash
npx prisma migrate deploy
```

4. Start the API:

```bash
npm run dev
```

API at http://localhost:3333

## Routes

- POST /orgs
- POST /sessions
- POST /pets (authenticated)
- GET /pets?city=Curitiba&size=SMALL
- GET /pets/:id

## Tests

```bash
npm test
```

## Postman Collection Test

With collection variables:

```bash
npm run postman:test
```

With dynamic ORG email (avoids registration conflict):

```bash
npm run postman:test:fresh
```
