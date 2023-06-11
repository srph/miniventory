![Thumbnail](./thumbnail.png)

# Miniventory

A personalized inventory system for our very small, humble business with terse footprint.

## Setup

Locally, this project requires Node >= 18 and Docker 2.

```bash
npm install
```

Setup the environment config by copying `.env.example` to `.env`. And then tweak the following:

```
# openssl rand -base64 32
NEXTAUTH_SECRET=

# Setup this through https://discord.com/developers/applications
# After creating the app, make sure to select Oauth2 tab and add
# "http://localhost:3000/api/auth/callback/discord" as redirect uri
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Setup this through https://uploadthing.com/
UPLOADTHING_APP_ID=
UPLOADTHING_SECRET=
```

Setup the database, the following opens up a db you can access via `mysql://root:root@127.0.0.1:3336/miniventory`

```bash
npm run db:docker
```

Afterwards, run the migrations:

```bash
npm run db:migrations

# Optional, only if you prefer to seed
npm run db:seed
```

Then, you're good to go:

```bash
npm run dev
```

## Prisma

This project runs prisma, and you can run some commands as you see fit:

```bash
npm run db:generate # Update schema type definitions
npm run db:studio # GUI
npm run db:migrate # Reset migrations
```
