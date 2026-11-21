# Portfolio Contact Backend

Production-oriented Express API for Kinshuk Saxena's portfolio contact form. Submissions are validated, stored in MongoDB and delivered through Resend with an optional acknowledgement email.

## Stack

- Node.js 20+
- Express 5
- MongoDB + Mongoose
- Resend
- Zod validation
- Helmet, CORS and request rate limiting

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required variables:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/kinshuk_portfolio
FRONTEND_URLS=http://localhost:5173
```

In production, also configure a verified Resend sender:

```env
RESEND_API_KEY=re_...
FROM_EMAIL=Kinshuk Portfolio <portfolio@your-domain.com>
TO_EMAIL=your-inbox@example.com
```

`FRONTEND_URLS` accepts a comma-separated origin allowlist.

## Endpoints

### `POST /api/contact`

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Project enquiry",
  "message": "I would like to discuss a new application."
}
```

Limits:

- name: 2–100 characters
- email: valid address, up to 254 characters
- subject: optional, up to 160 characters
- message: 10–4,000 characters
- five submissions per IP per 15 minutes

A successfully stored submission returns HTTP 201. Email delivery status does not cause the stored message to be lost.

### `GET /api/health`

Returns HTTP 200 only when the MongoDB connection is ready; otherwise it returns HTTP 503.

## Commands

```bash
npm start       # production-style start
npm run dev     # Node watch-mode development server
npm run check   # JavaScript syntax check
npm test        # validation and escaping tests
```

## Security behavior

- The server refuses to start without MongoDB.
- Production startup also requires Resend configuration.
- CORS uses an explicit allowlist.
- JSON bodies are limited to 20 KB.
- User input is validated and escaped before insertion into email HTML.
- Private error details are logged server-side and not returned to visitors.

Never commit `.env` or deployment credentials.
