import { pathToFileURL } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { Resend } from 'resend';
import { z } from 'zod';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 5000);
const frontendOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export const contactInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  subject: z.string().trim().max(160).optional().default('Portfolio enquiry'),
  message: z.string().trim().min(10).max(4000),
}).strict();

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  subject: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
  notificationStatus: {
    admin: { type: String, enum: ['sent', 'failed', 'skipped'], default: 'skipped' },
    autoReply: { type: String, enum: ['sent', 'failed', 'skipped'], default: 'skipped' },
  },
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const renderAdminEmail = submission => `
  <div style="font-family:Inter,Arial,sans-serif;background:#050810;color:#e5e7eb;padding:32px">
    <div style="max-width:620px;margin:auto;background:#0d1224;border:1px solid #1a3444;border-radius:18px;padding:32px">
      <p style="margin:0 0 8px;color:#67e8f9;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Portfolio contact</p>
      <h1 style="margin:0 0 24px;color:#f8fafc">${escapeHtml(submission.subject)}</h1>
      <p><strong>From:</strong> ${escapeHtml(submission.name)} &lt;${escapeHtml(submission.email)}&gt;</p>
      <div style="margin-top:24px;padding:20px;border-radius:12px;background:#080d1a;white-space:pre-wrap;line-height:1.65">${escapeHtml(submission.message)}</div>
    </div>
  </div>`;

const renderAutoReply = submission => `
  <div style="font-family:Inter,Arial,sans-serif;background:#f4f7fa;color:#1f2937;padding:32px">
    <div style="max-width:620px;margin:auto;background:#fff;border-radius:18px;padding:32px">
      <p style="margin:0 0 8px;color:#0891b2;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Message received</p>
      <h1 style="margin:0 0 20px">Thanks, ${escapeHtml(submission.name)}.</h1>
      <p style="line-height:1.65">Your message reached my portfolio inbox. I will review it and usually reply within 24–48 hours.</p>
      <div style="margin-top:20px;padding:16px;border-left:3px solid #06b6d4;background:#ecfeff">
        <strong>${escapeHtml(submission.subject)}</strong>
      </div>
    </div>
  </div>`;

export const createApp = ({ resendClient } = {}) => {
  const app = express();
  const resend = resendClient || (process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null);

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || frontendOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
  }));
  app.use(express.json({ limit: '20kb' }));

  app.get('/api/health', (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
      success: databaseReady,
      service: 'portfolio-backend',
      database: databaseReady ? 'ready' : 'unavailable',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/contact', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many messages. Please wait before trying again.' },
  }));

  app.post('/api/contact', async (req, res, next) => {
    try {
      const parsed = contactInput.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid name, email, subject and message.',
          fields: parsed.error.flatten().fieldErrors,
        });
      }

      const submission = await Contact.create(parsed.data);
      const delivery = { admin: 'skipped', autoReply: 'skipped' };

      if (resend && process.env.FROM_EMAIL && process.env.TO_EMAIL) {
        const [adminResult, replyResult] = await Promise.allSettled([
          resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            replyTo: parsed.data.email,
            subject: `Portfolio: ${parsed.data.subject}`,
            html: renderAdminEmail(parsed.data),
          }),
          resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: parsed.data.email,
            subject: 'Thank you for getting in touch',
            html: renderAutoReply(parsed.data),
          }),
        ]);
        delivery.admin = adminResult.status === 'fulfilled' ? 'sent' : 'failed';
        delivery.autoReply = replyResult.status === 'fulfilled' ? 'sent' : 'failed';
      }

      submission.notificationStatus = delivery;
      await submission.save();

      return res.status(201).json({
        success: true,
        message: 'Your message has been received.',
        submissionId: submission.id,
        notificationSent: delivery.admin === 'sent',
      });
    } catch (error) {
      return next(error);
    }
  });

  app.use((_req, res) => res.status(404).json({ success: false, message: 'Endpoint not found.' }));

  app.use((error, _req, res, _next) => {
    console.error('Request failed:', error instanceof Error ? error.message : error);
    const corsFailure = error instanceof Error && error.message.includes('CORS');
    res.status(corsFailure ? 403 : 500).json({
      success: false,
      message: corsFailure ? 'Origin is not allowed.' : 'An internal server error occurred.',
    });
  });

  return app;
};

export const startServer = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
  if (isProduction && (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.TO_EMAIL)) {
    throw new Error('RESEND_API_KEY, FROM_EMAIL and TO_EMAIL are required in production.');
  }

  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  const app = createApp();
  return app.listen(port, () => console.log(`Portfolio backend listening on port ${port}`));
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch(error => {
    console.error('Backend startup failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
