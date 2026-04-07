# misiones-en-casa

Misiones en Casa is a Next.js app backed by MySQL and Prisma.

## Development

Install dependencies:

```bash
npm install
```

Set your database connection string:

```bash
export DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/misiones_en_casa"
```

Start the app:

```bash
npm run dev
```

## Initialize MySQL

If the database does not exist yet, create it first:

```sql
CREATE DATABASE misiones_en_casa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Then initialize Prisma and seed the data:

```bash
npm run db:generate
npx prisma db push
npm run db:seed
```

This does the following:

- Generates the Prisma client
- Creates or updates the tables from `prisma/schema.prisma`
- Loads the sample data from `prisma/seed.ts`

## Useful Commands

Run the production build:

```bash
npm run build
```

Open Prisma Studio:

```bash
npm run db:studio
```

Create a migration later if you want Prisma to track schema history:

```bash
npx prisma migrate dev --name init
```

## Dokploy Deployment

The container now initializes the schema automatically on startup.

Required environment variables:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/misiones_en_casa"
SESSION_SECRET="replace-this-with-a-long-random-secret"
```

Optional environment variable:

```bash
SEED_DATABASE_ON_START=true
```

Startup behavior in Dokploy:

- Validates that `DATABASE_URL` is set
- Validates that `SESSION_SECRET` is set
- Runs `npx prisma db push --skip-generate`
- Optionally runs `npm run db:seed` if `SEED_DATABASE_ON_START=true`
- Starts the Next.js server

For the first deploy, it is usually safest to set `SEED_DATABASE_ON_START=true` once, then remove it for later deploys.
