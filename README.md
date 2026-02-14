## Pastebin Lite

A minimal Pastebin-like web application built with Next.js (App Router) and Vercel KV (Redis).

Users can create text pastes and share a link to view them. Each paste can optionally expire based on time (TTL) or number of views.

This project is designed for serverless deployment and automated evaluation.

## Features

Create a text paste

Get a shareable URL

View paste in browser

Optional expiration:

Time-based (TTL)

View-count limit

Deterministic time support for automated testing

Serverless-ready persistence using Vercel KV

## Tech Stack

Next.js (App Router)

Node.js

TypeScript

Vercel KV (Redis)

Vercel (Deployment)

## Persistence Layer

This project uses Vercel KV (Redis) as the persistence layer.

# Why Vercel KV?

Works reliably in serverless environments

Data persists across requests

Compatible with Vercel deployments

No in-memory storage issues

Each paste is stored using the key format:

paste:<id>

Example:

paste:abc123

Stored data structure:

{
"content": "Hello world",
"remaining_views": 5,
"expires_at": 1735689600000
}

## Environment Variables

The application requires the following environment variables:

Required
NEXT_PUBLIC_BASE_URL

Used to generate shareable paste URLs.

Example (local):

NEXT_PUBLIC_BASE_URL=http://localhost:3000

Optional (for deterministic testing)
TEST_MODE=1

When enabled, the application reads the request header:

x-test-now-ms

This allows expiry logic to use a deterministic timestamp (milliseconds since epoch) instead of system time.

An example file is provided in:

.env.example

## Running the Project Locally

1. Install dependencies
   npm install

2. Create environment file

Create:

.env.local

Add:

NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=1

3. Start development server
   npm run dev

Open:

http://localhost:3000

API Endpoints
Health Check
GET /api/healthz

Returns:

{ "ok": true }

Verifies access to the persistence layer.

Create Paste
POST /api/pastes

Request body:

{
"content": "Hello world",
"ttl_seconds": 60,
"max_views": 5
}

Fields:

content (required)

ttl_seconds (optional)

max_views (optional)

Response:

{
"id": "abc123",
"url": "https://your-domain.com/p/abc123"
}

Fetch Paste (API)
GET /api/pastes/:id

Response:

{
"content": "Hello world",
"remaining_views": 4,
"expires_at": "2026-01-01T00:00:00.000Z"
}

Each successful fetch counts as one view.

If expired or unavailable:

404 Not Found

View Paste (HTML)
GET /p/:id

Returns an HTML page displaying the paste content.

If expired or unavailable:

404 - Paste not found or expired

Expiration Logic

A paste becomes unavailable when:

TTL has expired, OR

View count reaches zero

Whichever happens first.

All unavailable pastes return:

HTTP 404

## Design Decisions

1. No In-Memory State

The application does not use global mutable state.
This ensures safe execution in serverless environments.

2. Safe Rendering

Paste content is rendered safely without executing scripts.

3. Deterministic Testing Support

When:

TEST_MODE=1

And the request includes:

x-test-now-ms: <timestamp>

Expiry logic uses the provided timestamp instead of system time.
This ensures predictable automated test behavior.

Deployment

Recommended deployment platform:

Vercel

## Steps:

Push repository to GitHub

Import project in Vercel

Add environment variables:

NEXT_PUBLIC_BASE_URL

KV_REST_API_URL

KV_REST_API_TOKEN

TEST_MODE (optional)

Deploy

## Author

Shubham Gavhane
