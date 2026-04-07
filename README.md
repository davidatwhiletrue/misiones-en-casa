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
