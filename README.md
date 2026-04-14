# Redvike API

Backend service for amenity management, reservations, and CSV import.

Built with:
- NestJS
- Prisma
- PostgreSQL
- Swagger

## What The API Does

- user registration and login
- CRUD for amenities
- CRUD for reservations
- bookings by amenity and day
- bookings by user grouped by day
- CSV upload with parsing to JSON

## Data Model

The project currently uses three main entities:

- `User`
- `Amenity`
- `Reservation`

Reservation fields:
- `id`
- `amenityId`
- `userId`
- `startTime`
- `endTime`

Both `startTime` and `endTime` are stored as `DateTime` in the database.

## Requirements

- Node.js 20+
- npm
- PostgreSQL

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/redvike?schema=public
JWT_SECRET=super-secret-key
PORT=3000
```

## Install

```bash
npm install
```

## Database Setup

Generate and apply Prisma migrations:

```bash
npx prisma migrate dev
```

Regenerate Prisma client if needed:

```bash
npx prisma generate
```

## Run The App

Development:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

The application runs on:

```text
http://localhost:3000
```

## Swagger

Swagger UI is available at:

```text
http://localhost:3000/api
```

The API uses a global prefix:

```text
/api
```

## Main Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Amenity

- `POST /api/amenity`
- `GET /api/amenity`
- `GET /api/amenity/:id`
- `PATCH /api/amenity/:id`
- `DELETE /api/amenity/:id`

### Reservation

- `POST /api/reservation`
- `GET /api/reservation`
- `GET /api/reservation/:id`
- `PATCH /api/reservation/:id`
- `DELETE /api/reservation/:id`

Additional read endpoints:

- `GET /api/reservation/amenities/:amenityId/bookings?day=2026-04-14T00:00:00.000Z`
- `GET /api/reservation/users/:userId/bookings`

#### Amenity Bookings By Day Response

Returns a list sorted by `startTime` ascending with:

- `reservationId`
- `userId`
- `startTime` in `HH:mm`
- `durationMinutes`
- `amenityName`

#### User Bookings Grouped By Day

Returns data grouped like this:

```json
[
  {
    "date": "2026-04-14",
    "reservations": [
      {
        "reservationId": "reservation-id",
        "amenityId": "amenity-id",
        "amenityName": "Conference Room",
        "startTime": "09:00",
        "endTime": "10:30",
        "durationMinutes": 90
      }
    ]
  }
]
```

This endpoint uses raw SQL through Prisma for the grouped booking read model.

### CSV Import

- `POST /api/csv/parse`

Request format:
- `multipart/form-data`
- file field name: `file`

Rules:
- only `.csv` files are accepted
- file size limit: 20 MB
- supports both `,` and `;` delimiters
- first row is treated as headers

Example response:

```json
[
  {
    "id": "1",
    "name": "Conference Room"
  }
]
```

## Error Handling

The project includes:

- global exception handling
- Prisma exception mapping
- request id propagation
- structured error responses
- Nest `Logger` based logging for both `4xx` and `5xx`

Error response shape:

```json
{
  "statusCode": 400,
  "message": "Only CSV files are allowed",
  "error": "Bad Request",
  "timestamp": "2026-04-14T12:00:00.000Z",
  "path": "/api/csv/parse",
  "requestId": "request-id"
}
```

## Validation Notes

- DTO validation is enabled globally with Nest `ValidationPipe`
- reservation create/update expects ISO date strings
- CSV parsing strips BOM and supports quoted values and escaped quotes

## Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run test
npm run test:e2e
```

## Tests

Run unit tests:

```bash
npm test -- --runInBand
```

Run e2e tests:

```bash
npm run test:e2e
```

## Notes

- Prisma client is generated into `generated/prisma`
- Swagger is configured in `src/main.ts`
- database access is implemented through Prisma
- request-level errors are normalized by global exception filters
