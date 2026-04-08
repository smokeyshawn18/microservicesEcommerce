# Auth Middleware Testing Guide

This guide explains how to test the authentication middleware across all three services (Product, Order, and Payment) using the client test page.

## Services Overview

| Service         | Framework | Port | Clerk Package    | Entry Point                         |
| --------------- | --------- | ---- | ---------------- | ----------------------------------- |
| Product Service | Express   | 8000 | @clerk/express   | `apps/product-service/src/index.ts` |
| Order Service   | Fastify   | 8001 | @clerk/fastify   | `apps/order-service/src/index.ts`   |
| Payment Service | Hono      | 8002 | @hono/clerk-auth | `apps/payment-service/src/index.ts` |
| Client          | Next.js   | 3002 | @clerk/nextjs    | `apps/client/src/app`               |

## Setup Instructions

### 1. Install Dependencies

First, install the newly added CORS dependency for the order service:

```bash
cd /home/shawn/Projects/nepcart
pnpm install
```

### 2. Environment Setup

Ensure all services have the required environment variables. You need Clerk API keys:

```bash
# In each service directory (.env file):
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 3. Start All Services

Run all services together using Turbo:

```bash
pnpm dev
```

Or run them individually in separate terminals:

**Terminal 1 - Product Service:**

```bash
cd apps/product-service
npm run dev
```

**Terminal 2 - Order Service:**

```bash
cd apps/order-service
npm run dev
```

**Terminal 3 - Payment Service:**

```bash
cd apps/payment-service
npm run dev
```

**Terminal 4 - Client:**

```bash
cd apps/client
npm run dev
```

## Testing the Auth Middleware

### Via Test Page

1. Navigate to: `http://localhost:3002/test`
2. The page automatically tests all three services
3. You should see results for each service showing:
   - ✓ **Passed** (200 status + userId in response) - authentication succeeded
   - ✗ **Failed** (401 status or connection error) - authentication failed

### Expected Results

When properly authenticated:

```json
{
  "service": "Product Service (8000)",
  "status": "200",
  "success": true,
  "data": {
    "message": "Product Service Authenticated",
    "userId": "user_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

### Test Endpoints

All endpoints are protected by their respective auth middleware:

**Product Service:**

```
GET http://localhost:8000/test
```

**Order Service:**

```
GET http://localhost:8001/test
```

**Payment Service:**

```
GET http://localhost:8002/test
```

**Health Check (No Auth Required):**

```
GET http://localhost:8000/health
GET http://localhost:8001/health
GET http://localhost:8002/health
```

## How the Tests Work

The test page (`apps/client/src/app/test/page.tsx`):

1. **Client-Side Component**: Uses React `useEffect` to run tests on page load
2. **Auth Handling**: The Clerk middleware automatically includes authentication tokens in requests via cookies
3. **CORS**: Each service is configured to accept requests from `localhost:3002` and `localhost:3003`
4. **Results Display**: Shows formatted results with pass/fail status and response data

## Authorization Middleware Implementation

### Product Service (Express)

- Location: `apps/product-service/src/middleware/authMiddleware.ts`
- Uses: `@clerk/express` → `getAuth(req)`
- Validation: Checks for `auth.userId`
- Response: 401 JSON if not authenticated

### Order Service (Fastify)

- Location: `apps/order-service/src/middleware/authMiddleware.ts`
- Uses: `@clerk/fastify` → `getAuth(req)`
- Validation: Checks for `userId`
- Response: 401 JSON if not authenticated

### Payment Service (Hono)

- Location: `apps/payment-service/src/middleware/authMiddleware.ts`
- Uses: `@hono/clerk-auth` → `getAuth(c)`
- Validation: Checks for `auth.userId`
- Response: Returns JSON response that stops execution

## Troubleshooting

### Tests Show 401 Errors

**Issue**: Authentication is failing

**Solutions:**

1. Ensure you're logged in to your Clerk account in the browser
2. Check that Clerk environment variables are set correctly
3. Verify cookies are enabled in browser
4. Check Clerk dashboard that your app is properly configured

### Tests Show Connection Errors

**Issue**: Services are not running or not accessible

**Solutions:**

1. Verify all services are running: `pnpm dev`
2. Check port availability: `lsof -i:8000`, `lsof -i:8001`, `lsof -i:8002`
3. Check service logs for startup errors
4. Verify CORS configuration in each service

### CORS Errors in Browser Console

**Issue**: Browser blocks cross-origin requests

**Solutions:**

1. Verify CORS is properly configured in each service:
   - Product Service: `apps/product-service/src/index.ts`
   - Order Service: `apps/order-service/src/index.ts`
   - Payment Service: `apps/payment-service/src/index.ts`
2. Ensure client runs on `localhost:3002`
3. Check browser console for exact CORS error message

## Manual Testing with cURL

You can also test manually using cURL if you have a Clerk session token:

```bash
# Get session token from browser
# 1. Open DevTools (F12)
# 2. Look in Application → Cookies for __session cookie

# Test Product Service
curl -H "Cookie: __session=YOUR_TOKEN" http://localhost:8000/test

# Test Order Service
curl -H "Cookie: __session=YOUR_TOKEN" http://localhost:8001/test

# Test Payment Service
curl -H "Cookie: __session=YOUR_TOKEN" http://localhost:8002/test

# Health checks (no auth needed)
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

## Advanced Testing

### Test Unauthenticated Requests

Modify the test page temporarily to test without authentication:

```typescript
// Remove credentials to test unauthenticated
const productRes = await fetch("http://localhost:8000/test", {
  // credentials: "include",  // Comment this out
  cache: "no-store",
});
```

Expected result: 401 status with error message

### Test with Different Users

1. Sign out from current user
2. Sign in as different user
3. Run test page
4. Verify `userId` in response matches new user

## Summary

✅ **Product Service (Express)**: Uses `@clerk/express` with Express middleware pattern
✅ **Order Service (Fastify)**: Uses `@clerk/fastify` with Fastify preHandler pattern
✅ **Payment Service (Hono)**: Uses `@hono/clerk-auth` with Hono middleware pattern
✅ **Client Test Page**: Automatically tests all three services with visual feedback
✅ **CORS Configured**: All services accept requests from client on localhost:3002

All auth middleware implementations follow the same pattern: **validate user is authenticated, reject with 401 if not, attach userId to request if authenticated**.
