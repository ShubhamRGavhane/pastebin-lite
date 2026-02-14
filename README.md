### Pastebin Lite

Pastebin Lite is a small Pastebin-like web application that allows users to create text pastes and share a URL to view them.
Each paste can optionally expire based on time (TTL) or number of views.
This project is built as a take-home assignment and is evaluated primarily through automated tests against the deployed application.

## Project Description

The application allows a user to:

Create a paste containing arbitrary text
Receive a shareable URL for that paste
Visit the URL to view the paste
Have pastes become unavailable based on optional constraints such as time expiry or view limits

## Tech Stack

Next.js (App Router)
Node.js
TypeScript
Vercel KV (Redis)

## Persistence Layer

The application uses Vercel KV (Redis) as its persistence layer.
Reason for choosing this persistence layer:
In-memory storage is unreliable in serverless environments
Vercel KV persists data across requests
It works correctly with automated tests running against a deployed Vercel application

## Environment Variables

The application relies on the following environment variables:

NEXT_PUBLIC_BASE_URL
Used to generate the shareable paste URL.

TEST_MODE
When set to 1, the application supports deterministic time testing using the request header
x-test-now-ms (milliseconds since epoch) for expiry logic.

An example environment file is provided in .env.example.

## Running the Application Locally

    Install dependencies : npm install

# Create a local environment file

Create a file named .env.local in the project root with the following values:

NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=1

# Start the development server

    npm run dev

The application will be available at:
http://localhost:3000

## API Routes

    GET /api/healthz
    Health check endpoint that returns JSON and verifies access to the persistence layer.

    POST /api/pastes
    Creates a new paste with optional TTL and view-count constraints.

    GET /api/pastes/:id
    Fetches a paste via API. Each successful fetch counts as a view.

    GET /p/:id
    Returns an HTML page displaying the paste content.

## Design Notes

    All unavailable pastes return HTTP 404 responses
    Invalid inputs return appropriate 4xx responses with JSON error bodies
    Paste content is rendered safely without script execution
    No global mutable state is used, making the app safe for serverless deployment
    The application is designed to behave deterministically under automated testing conditions
