import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// ✅ Resend Email Setup
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ POST: /api/contact
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Email, Message).",
      });
    }

    // Save contact info to DB
    const newContact = new Contact({
      name,
      email,
      subject: subject || "No Subject",
      message,
    });

    await newContact.save();
    console.log("✅ Contact form data saved to database.");

    // ✅ Email to Admin
    await resend.emails.send({
      from: "Kinshuk Portfolio <onboarding@resend.dev>",
      to: "kinshuksaxena3@gmail.com",
      subject: `🔔 New Contact Form: ${subject || "No Subject"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                      <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop" alt="Portfolio" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #ffffff; margin-bottom: 15px;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">📬 New Message Received!</h1>
                      <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 14px;">Someone reached out through your portfolio</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px;">Contact Details</h2>
                      
                      <!-- Sender Info Card -->
                      <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">👤 From</p>
                            <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 600;">${name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📧 Email</p>
                            <p style="margin: 0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-size: 16px;">${email}</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📝 Subject</p>
                            <p style="margin: 0; color: #1f2937; font-size: 16px;">${subject || "No Subject"}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message Box -->
                      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <p style="margin: 0 0 10px; color: #1e40af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">💬 Message</p>
                        <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                      </div>
                      
                      <!-- Quick Actions -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your Message")}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                              ✉️ Reply Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 15px; color: #6b7280; font-size: 13px;">
                        Received on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        This email was sent from your portfolio contact form
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log("✅ Notification email sent to admin via Resend.");

    // ✅ Auto-reply to user
    await resend.emails.send({
      from: "Kinshuk Saxena <onboarding@resend.dev>",
      to: email,
      subject: "✅ Thank you for reaching out!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px;">
                  
                  <!-- Header with Success Icon -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 30px; text-align: center;">
                      <div style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="font-size: 48px;">✅</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Message Received!</h1>
                      <p style="color: #d1fae5; margin: 15px 0 0; font-size: 16px;">Thank you for reaching out</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px;">Hi ${name}, 👋</h2>
                      
                      <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Thank you for getting in touch! I've successfully received your message and really appreciate you taking the time to reach out.
                      </p>
                      
                      <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        I'll review your message and get back to you as soon as possible, typically within <strong>24-48 hours</strong>. In the meantime, feel free to connect with me on social media for faster responses!
                      </p>
                      
                      <!-- Your Message Summary -->
                      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #10b981;">
                        <p style="margin: 0 0 10px; color: #059669; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📋 Your Message Summary</p>
                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${subject || "No Subject"}</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Sent:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                      </div>
                      
                      <!-- Social Media Links -->
                      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 20px; color: #1e40af; font-size: 18px; text-align: center;">🚀 Connect With Me</h3>
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 14px; text-align: center;">For faster responses, reach out on social media!</p>
                        
                        <!-- Social Icons -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <!-- GitHub -->
                                  <td style="padding: 0 10px;">
                                    <a href="https://github.com/kinshukkush" style="display: inline-block; width: 48px; height: 48px; background-color: #24292e; border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                      <img src="https://cdn-icons-png.flaticon.com/128/25/25231.png" alt="GitHub" style="width: 24px; height: 24px; vertical-align: middle;">
                                    </a>
                                  </td>
                                  <!-- LinkedIn -->
                                  <td style="padding: 0 10px;">
                                    <a href="https://www.linkedin.com/in/kinshuk-saxena-/" style="display: inline-block; width: 48px; height: 48px; background-color: #0077B5; border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                      <img src="https://cdn-icons-png.flaticon.com/128/174/174857.png" alt="LinkedIn" style="width: 24px; height: 24px; vertical-align: middle;">
                                    </a>
                                  </td>
                                  <!-- Email -->
                                  <td style="padding: 0 10px;">
                                    <a href="mailto:kinshuksaxena3@gmail.com" style="display: inline-block; width: 48px; height: 48px; background-color: #EA4335; border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                      <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" alt="Email" style="width: 24px; height: 24px; vertical-align: middle;">
                                    </a>
                                  </td>
                                  <!-- Instagram -->
                                  <td style="padding: 0 10px;">
                                    <a href="https://www.instagram.com/kinshuk._.saxena/" style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                      <img src="https://cdn-icons-png.flaticon.com/128/174/174855.png" alt="Instagram" style="width: 24px; height: 24px; vertical-align: middle;">
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Social Links Text -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                          <tr>
                            <td align="center">
                              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                                <a href="https://github.com/kinshukkush" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">GitHub</a> |
                                <a href="https://www.linkedin.com/in/kinshuk-saxena-/" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">LinkedIn</a> |
                                <a href="mailto:kinshuksaxena3@gmail.com" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Email</a> |
                                <a href="https://www.instagram.com/kinshuk._.saxena/" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Instagram</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                        <tr>
                          <td align="center">
                            <a href="https://portfolio-frontend-mu-snowy.vercel.app/" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                              🌐 Visit My Portfolio
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px; color: #1f2937; font-size: 16px; font-weight: 600;">
                        Best regards,<br>
                        <span style="color: #3b82f6; font-size: 18px;">Kinshuk Saxena</span>
                      </p>
                      <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
                        Full Stack Developer | UI/UX Enthusiast
                      </p>
                      <div style="width: 60px; height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); margin: 15px auto;"></div>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        This is an automated response. I'll personally reply to you soon!
                      </p>
                      <p style="margin: 10px 0 0; color: #9ca3af; font-size: 11px;">
                        © ${new Date().getFullYear()} Kinshuk Saxena. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log(`✅ Auto-reply sent to ${email} via Resend.`);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error processing contact form:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
});

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.send("✅ Portfolio backend is running via Render + Resend!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
