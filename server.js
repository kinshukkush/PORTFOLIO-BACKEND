// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Resend } from "resend";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // ✅ MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ MongoDB connected successfully"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ✅ Mongoose Schema
// const contactSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, trim: true, lowercase: true },
//   subject: { type: String, trim: true },
//   message: { type: String, required: true, trim: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Contact = mongoose.model("Contact", contactSchema);

// // ✅ Resend Email Setup
// const resend = new Resend(process.env.RESEND_API_KEY);

// // ✅ POST: /api/contact
// app.post("/api/contact", async (req, res) => {
//   try {
//     const { name, email, subject, message } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill in all required fields (Name, Email, Message).",
//       });
//     }

//     // Save contact info to DB
//     const newContact = new Contact({
//       name,
//       email,
//       subject: subject || "No Subject",
//       message,
//     });

//     await newContact.save();
//     console.log("✅ Contact form data saved to database.");

//     // ✅ Email to Admin
//     await resend.emails.send({
//       from: "Kinshuk Portfolio <onboarding@resend.dev>",
//       to: "kinshuksaxena3@gmail.com",
//       subject: `🔔 New Contact Form: ${subject || "No Subject"}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         </head>
//         <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
//           <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
//             <tr>
//               <td align="center">
//                 <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px;">
                  
//                   <!-- Header -->
//                   <tr>
//                     <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
//                       <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop" alt="Portfolio" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #ffffff; margin-bottom: 15px;">
//                       <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">📬 New Message Received!</h1>
//                       <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 14px;">Someone reached out through your portfolio</p>
//                     </td>
//                   </tr>
                  
//                   <!-- Content -->
//                   <tr>
//                     <td style="padding: 40px 30px;">
//                       <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px;">Contact Details</h2>
                      
//                       <!-- Sender Info Card -->
//                       <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
//                         <tr>
//                           <td>
//                             <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">👤 From</p>
//                             <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 600;">${name}</p>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
//                             <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📧 Email</p>
//                             <p style="margin: 0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-size: 16px;">${email}</a></p>
//                           </td>
//                         </tr>
//                         <tr>
//                           <td style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
//                             <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📝 Subject</p>
//                             <p style="margin: 0; color: #1f2937; font-size: 16px;">${subject || "No Subject"}</p>
//                           </td>
//                         </tr>
//                       </table>
                      
//                       <!-- Message Box -->
//                       <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
//                         <p style="margin: 0 0 10px; color: #1e40af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">💬 Message</p>
//                         <p style="margin: 0; color: #1f2937; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
//                       </div>
                      
//                       <!-- Quick Actions -->
//                       <table width="100%" cellpadding="0" cellspacing="0">
//                         <tr>
//                           <td align="center" style="padding: 20px 0;">
//                             <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your Message")}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
//                               ✉️ Reply Now
//                             </a>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
                  
//                   <!-- Footer -->
//                   <tr>
//                     <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
//                       <p style="margin: 0 0 15px; color: #6b7280; font-size: 13px;">
//                         Received on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                       <p style="margin: 0; color: #9ca3af; font-size: 12px;">
//                         This email was sent from your portfolio contact form
//                       </p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//         </html>
//       `,
//     });
//     console.log("✅ Notification email sent to admin via Resend.");

//     // ✅ Auto-reply to user
//     await resend.emails.send({
//       from: "Kinshuk Saxena <onboarding@resend.dev>",
//       to: email,
//       subject: "✅ Thank you for reaching out!",
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         </head>
//         <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
//           <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
//             <tr>
//               <td align="center">
//                 <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px;">
                  
//                   <!-- Header with Success Icon -->
//                   <tr>
//                     <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 30px; text-align: center;">
//                       <div style="width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
//                         <span style="font-size: 48px;">✅</span>
//                       </div>
//                       <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Message Received!</h1>
//                       <p style="color: #d1fae5; margin: 15px 0 0; font-size: 16px;">Thank you for reaching out</p>
//                     </td>
//                   </tr>
                  
//                   <!-- Content -->
//                   <tr>
//                     <td style="padding: 40px 30px;">
//                       <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px;">Hi ${name}, 👋</h2>
                      
//                       <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
//                         Thank you for getting in touch! I've successfully received your message and really appreciate you taking the time to reach out.
//                       </p>
                      
//                       <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
//                         I'll review your message and get back to you as soon as possible, typically within <strong>24-48 hours</strong>. In the meantime, feel free to connect with me on social media for faster responses!
//                       </p>
                      
//                       <!-- Your Message Summary -->
//                       <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #10b981;">
//                         <p style="margin: 0 0 10px; color: #059669; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">📋 Your Message Summary</p>
//                         <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${subject || "No Subject"}</p>
//                         <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Sent:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
//                       </div>
                      
//                       <!-- Social Media Links -->
//                       <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
//                         <h3 style="margin: 0 0 20px; color: #1e40af; font-size: 18px; text-align: center;">🚀 Connect With Me</h3>
//                         <p style="margin: 0 0 20px; color: #4b5563; font-size: 14px; text-align: center;">For faster responses, reach out on social media!</p>
                        
//                         <!-- Social Icons -->
//                         <table width="100%" cellpadding="0" cellspacing="0">
//                           <tr>
//                             <td align="center">
//                               <table cellpadding="0" cellspacing="0">
//                                 <tr>
//                                   <!-- GitHub -->
//                                   <td style="padding: 0 10px;">
//                                     <a href="https://github.com/kinshukkush" style="display: inline-block; width: 48px; height: 48px; background-color: #24292e; border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;">
//                                       <img src="https://cdn-icons-png.flaticon.com/128/25/25231.png" alt="GitHub" style="width: 24px; height: 24px; vertical-align: middle;">
//                                     </a>
//                                   </td>
//                                   <!-- LinkedIn -->
//                                   <td style="padding: 0 10px;">
//                                     <a href="https://www.linkedin.com/in/kinshuk-saxena-/" style="display: inline-block; width: 48px; height: 48px; background-color: #0077B5; border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//                                       <img src="https://cdn-icons-png.flaticon.com/128/174/174857.png" alt="LinkedIn" style="width: 24px; height: 24px; vertical-align: middle;">
//                                     </a>
//                                   </td>
//                                   <!-- Email -->
//                                   <td style="padding: 0 10px;">
//                                     <a href="mailto:kinshuksaxena3@gmail.com" style="display: inline-block; width: 48px; height: 48px; background-color: #EA4335; border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//                                       <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" alt="Email" style="width: 24px; height: 24px; vertical-align: middle;">
//                                     </a>
//                                   </td>
//                                   <!-- Instagram -->
//                                   <td style="padding: 0 10px;">
//                                     <a href="https://www.instagram.com/kinshuk._.saxena/" style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); border-radius: 50%; text-align: center; line-height: 48px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//                                       <img src="https://cdn-icons-png.flaticon.com/128/174/174855.png" alt="Instagram" style="width: 24px; height: 24px; vertical-align: middle;">
//                                     </a>
//                                   </td>
//                                 </tr>
//                               </table>
//                             </td>
//                           </tr>
//                         </table>
                        
//                         <!-- Social Links Text -->
//                         <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
//                           <tr>
//                             <td align="center">
//                               <p style="margin: 0; color: #6b7280; font-size: 13px;">
//                                 <a href="https://github.com/kinshukkush" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">GitHub</a> |
//                                 <a href="https://www.linkedin.com/in/kinshuk-saxena-/" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">LinkedIn</a> |
//                                 <a href="mailto:kinshuksaxena3@gmail.com" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Email</a> |
//                                 <a href="https://www.instagram.com/kinshuk._.saxena/" style="color: #3b82f6; text-decoration: none; margin: 0 8px;">Instagram</a>
//                               </p>
//                             </td>
//                           </tr>
//                         </table>
//                       </div>
                      
//                       <!-- CTA Button -->
//                       <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
//                         <tr>
//                           <td align="center">
//                             <a href="https://portfolio-frontend-mu-snowy.vercel.app/" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
//                               🌐 Visit My Portfolio
//                             </a>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
                  
//                   <!-- Footer -->
//                   <tr>
//                     <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
//                       <p style="margin: 0 0 10px; color: #1f2937; font-size: 16px; font-weight: 600;">
//                         Best regards,<br>
//                         <span style="color: #3b82f6; font-size: 18px;">Kinshuk Saxena</span>
//                       </p>
//                       <p style="margin: 0 0 15px; color: #6b7280; font-size: 14px;">
//                         Full Stack Developer | UI/UX Enthusiast
//                       </p>
//                       <div style="width: 60px; height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); margin: 15px auto;"></div>
//                       <p style="margin: 0; color: #9ca3af; font-size: 12px;">
//                         This is an automated response. I'll personally reply to you soon!
//                       </p>
//                       <p style="margin: 10px 0 0; color: #9ca3af; font-size: 11px;">
//                         © ${new Date().getFullYear()} Kinshuk Saxena. All rights reserved.
//                       </p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//         </html>
//       `,
//     });
//     console.log(`✅ Auto-reply sent to ${email} via Resend.`);

//     res.status(200).json({
//       success: true,
//       message: "Your message has been sent successfully!",
//     });
//   } catch (error) {
//     console.error("❌ Error processing contact form:", error);
//     res.status(500).json({
//       success: false,
//       message: "An internal server error occurred. Please try again later.",
//     });
//   }
// });

// // ✅ Test Route
// app.get("/api/test", (req, res) => {
//   res.send("✅ Portfolio backend is running via Render + Resend!");
// });

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






































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

    const receivedAt = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ✅ EMAIL TO ADMIN — Premium Dark Theme
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    await resend.emails.send({
      from: "Kinshuk Portfolio <onboarding@resend.dev>",
      to: "kinshuksaxena3@gmail.com",
      subject: `🔔 New Contact Form: ${subject || "No Subject"}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Message — Kinshuk Portfolio</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <!-- Outer Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;">

          <!-- ── TOP ACCENT BAR ── -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#06b6d4 100%);border-radius:12px 12px 0 0;"></td>
          </tr>

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(145deg,#1e293b 0%,#0f172a 100%);padding:44px 40px 36px;text-align:center;border-left:1px solid #1e3a5f;border-right:1px solid #1e3a5f;">
              <!-- Avatar Ring -->
              <div style="display:inline-block;padding:4px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;margin-bottom:20px;">
                <div style="background:#0f172a;border-radius:50%;padding:3px;">
                  <img
                    src="https://ui-avatars.com/api/?name=K+S&background=3b82f6&color=fff&size=80&bold=true&font-size=0.4"
                    alt="KS"
                    style="width:76px;height:76px;border-radius:50%;display:block;"
                  />
                </div>
              </div>

              <!-- Ping Badge -->
              <div style="display:inline-block;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.4);color:#93c5fd;font-size:12px;font-weight:600;padding:5px 14px;border-radius:20px;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:16px;">
                📬 &nbsp;New Portfolio Message
              </div>

              <h1 style="color:#f1f5f9;margin:0 0 10px;font-size:30px;font-weight:700;letter-spacing:-0.5px;">
                You've Got Mail!
              </h1>
              <p style="color:#64748b;margin:0;font-size:14px;line-height:1.6;">
                Someone just reached out through your portfolio contact form
              </p>
            </td>
          </tr>

          <!-- ── SENDER DETAILS CARD ── -->
          <tr>
            <td style="background:#131d2e;padding:32px 40px 24px;border-left:1px solid #1e3a5f;border-right:1px solid #1e3a5f;">

              <p style="margin:0 0 20px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;">
                👤 &nbsp;Sender Information
              </p>

              <!-- Info Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Name Row -->
                <tr>
                  <td style="padding:14px 18px;background:rgba(30,58,95,0.4);border-radius:10px;margin-bottom:10px;display:block;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Name</p>
                          <p style="margin:0;color:#f1f5f9;font-size:20px;font-weight:700;">${name}</p>
                        </td>
                        <td align="right">
                          <div style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:8px 12px;color:#60a5fa;font-size:20px;">👤</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>

                <!-- Email Row -->
                <tr>
                  <td style="padding:14px 18px;background:rgba(30,58,95,0.4);border-radius:10px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Email</p>
                          <a href="mailto:${email}" style="color:#60a5fa;font-size:16px;text-decoration:none;font-weight:500;">${email}</a>
                        </td>
                        <td align="right">
                          <div style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:8px 12px;color:#60a5fa;font-size:20px;">📧</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>

                <!-- Subject Row -->
                <tr>
                  <td style="padding:14px 18px;background:rgba(30,58,95,0.4);border-radius:10px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Subject</p>
                          <p style="margin:0;color:#f1f5f9;font-size:16px;font-weight:500;">${subject || "No Subject"}</p>
                        </td>
                        <td align="right">
                          <div style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:8px 12px;color:#60a5fa;font-size:20px;">📝</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── MESSAGE BOX ── -->
          <tr>
            <td style="background:#131d2e;padding:8px 40px 32px;border-left:1px solid #1e3a5f;border-right:1px solid #1e3a5f;">
              <div style="border:1px solid #1e40af;border-radius:12px;overflow:hidden;">
                <!-- Message Header Bar -->
                <div style="background:linear-gradient(90deg,#1e3a8a,#1e40af);padding:12px 20px;">
                  <p style="margin:0;color:#93c5fd;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
                    💬 &nbsp;Message Content
                  </p>
                </div>
                <!-- Message Body -->
                <div style="background:rgba(15,23,42,0.8);padding:24px 20px;">
                  <p style="margin:0;color:#cbd5e1;font-size:15px;line-height:1.8;white-space:pre-wrap;">${message}</p>
                </div>
              </div>
            </td>
          </tr>

          <!-- ── REPLY BUTTON ── -->
          <tr>
            <td style="background:#131d2e;padding:4px 40px 36px;text-align:center;border-left:1px solid #1e3a5f;border-right:1px solid #1e3a5f;">
              <a
                href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your Message")}"
                style="display:inline-block;background:linear-gradient(135deg,#3b82f6 0%,#2563eb 100%);color:#ffffff;padding:16px 48px;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 8px 24px rgba(59,130,246,0.35);"
              >
                ✉️ &nbsp;&nbsp;Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- ── TIMESTAMP STRIP ── -->
          <tr>
            <td style="background:rgba(15,23,42,0.95);padding:16px 40px;border-left:1px solid #1e3a5f;border-right:1px solid #1e3a5f;border-top:1px solid #1e293b;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#475569;font-size:12px;">
                      🕐 &nbsp;Received: <span style="color:#94a3b8;font-weight:600;">${receivedAt}</span>
                    </p>
                  </td>
                  <td align="right">
                    <div style="display:inline-block;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;padding:4px 12px;">
                      <p style="margin:0;color:#34d399;font-size:11px;font-weight:600;">● &nbsp;LIVE</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#0a1628;padding:32px 40px;text-align:center;border:1px solid #1e3a5f;border-radius:0 0 12px 12px;">

              <!-- Name & Title -->
              <p style="margin:0 0 4px;color:#f1f5f9;font-size:18px;font-weight:700;">Kinshuk Saxena</p>
              <p style="margin:0 0 20px;color:#64748b;font-size:13px;">Full Stack Developer &nbsp;|&nbsp; React Native Enthusiast &nbsp;|&nbsp; Music Lover 🎵</p>

              <!-- Badge Row (shields-style) -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
                <tr>
                  <!-- GitHub Badge -->
                  <td style="padding:0 4px 8px;">
                    <a href="https://github.com/kinshukkush" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:26px;">
                        <tr>
                          <td style="background:#555;padding:0 8px;height:26px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/25/25231.png" width="14" height="14" style="display:inline-block;vertical-align:middle;filter:brightness(10);" alt="github"/>
                            <span style="color:#fff;font-size:11px;font-weight:600;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:4px;">GitHub</span>
                          </td>
                          <td style="background:#181717;padding:0 10px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">kinshukkush</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                  <!-- LinkedIn Badge -->
                  <td style="padding:0 4px 8px;">
                    <a href="https://www.linkedin.com/in/kinshuk-saxena-/" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:26px;">
                        <tr>
                          <td style="background:#555;padding:0 8px;height:26px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/174/174857.png" width="14" height="14" style="display:inline-block;vertical-align:middle;filter:brightness(10);" alt="linkedin"/>
                            <span style="color:#fff;font-size:11px;font-weight:600;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:4px;">LinkedIn</span>
                          </td>
                          <td style="background:#0077B5;padding:0 10px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">kinshuk-saxena</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <!-- Portfolio Badge -->
                  <td style="padding:0 4px 8px;">
                    <a href="https://portfolio-frontend-mu-snowy.vercel.app/" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:26px;">
                        <tr>
                          <td style="background:#555;padding:0 8px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:13px;vertical-align:middle;">🌐</span>
                            <span style="color:#fff;font-size:11px;font-weight:600;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:4px;">Portfolio</span>
                          </td>
                          <td style="background:#FF5722;padding:0 10px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">Visit Website</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                  <!-- Email Badge -->
                  <td style="padding:0 4px 8px;">
                    <a href="mailto:kinshuksaxena3@gmail.com" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:26px;">
                        <tr>
                          <td style="background:#555;padding:0 8px;height:26px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" width="14" height="14" style="display:inline-block;vertical-align:middle;filter:brightness(10);" alt="email"/>
                            <span style="color:#fff;font-size:11px;font-weight:600;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:4px;">Email</span>
                          </td>
                          <td style="background:#D14836;padding:0 10px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">kinshuksaxena3@gmail.com</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <!-- Phone / WhatsApp Badge -->
                  <td colspan="2" style="padding:0 4px 0;" align="center">
                    <a href="tel:+919057538521" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:26px;">
                        <tr>
                          <td style="background:#555;padding:0 8px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:13px;vertical-align:middle;">📱</span>
                            <span style="color:#fff;font-size:11px;font-weight:600;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:4px;">Phone</span>
                          </td>
                          <td style="background:#25D366;padding:0 10px;height:26px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">+91 90575 38521</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1e3a5f,transparent);margin:20px 0;"></div>

              <!-- Made with love -->
              <p style="margin:0 0 6px;color:#64748b;font-size:13px;">
                Made with <span style="color:#ef4444;">❤️</span> and <span style="color:#a78bfa;">🎵</span> by <strong style="color:#93c5fd;">Kinshuk Saxena</strong>
              </p>
              <p style="margin:0;color:#334155;font-size:11px;">
                © ${new Date().getFullYear()} Kinshuk Saxena. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- ── BOTTOM ACCENT BAR ── -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#06b6d4 100%);border-radius:0 0 8px 8px;"></td>
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

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ✅ AUTO-REPLY TO USER — Premium Green Theme
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    await resend.emails.send({
      from: "Kinshuk Saxena <onboarding@resend.dev>",
      to: email,
      subject: "✅ Got your message — I'll be in touch soon!",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message Received — Kinshuk Saxena</title>
</head>
<body style="margin:0;padding:0;background-color:#0a1628;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a1628;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;">

          <!-- ── TOP ACCENT BAR ── -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#10b981 0%,#3b82f6 50%,#8b5cf6 100%);border-radius:12px 12px 0 0;"></td>
          </tr>

          <!-- ── HERO HEADER ── -->
          <tr>
            <td style="background:linear-gradient(160deg,#0d2137 0%,#0a3d2e 100%);padding:50px 40px 40px;text-align:center;border-left:1px solid #134e37;border-right:1px solid #134e37;">

              <!-- Success Circle -->
              <div style="display:inline-block;width:90px;height:90px;background:linear-gradient(135deg,#10b981,#059669);border-radius:50%;margin-bottom:22px;text-align:center;line-height:90px;box-shadow:0 0 40px rgba(16,185,129,0.35);">
                <span style="font-size:44px;line-height:90px;">✅</span>
              </div>

              <!-- Status Pill -->
              <div style="display:inline-block;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);color:#6ee7b7;font-size:11px;font-weight:700;padding:5px 16px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;margin-bottom:18px;">
                ✓ &nbsp;Message Delivered Successfully
              </div>

              <h1 style="color:#f0fdf4;margin:0 0 12px;font-size:34px;font-weight:800;letter-spacing:-0.8px;">
                Message Received! 🎉
              </h1>
              <p style="color:#6ee7b7;margin:0;font-size:16px;line-height:1.5;">
                Hey <strong>${name}</strong>, I've got your message loud and clear!
              </p>
            </td>
          </tr>

          <!-- ── GREETING CARD ── -->
          <tr>
            <td style="background:#0d1f35;padding:36px 40px 28px;border-left:1px solid #134e37;border-right:1px solid #134e37;">

              <p style="margin:0 0 18px;color:#cbd5e1;font-size:16px;line-height:1.8;">
                Thank you for taking the time to reach out! Your message means a lot to me.
                I personally review every single inquiry and promise to get back to you with a thoughtful response.
              </p>

              <!-- Response Time Banner -->
              <div style="background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(59,130,246,0.12));border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:20px 24px;margin:20px 0 28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="text-align:center;">
                      <p style="margin:0 0 6px;color:#6ee7b7;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">⚡ Expected Response Time</p>
                      <p style="margin:0;color:#f0fdf4;font-size:28px;font-weight:800;">24 – 48 Hours</p>
                      <p style="margin:6px 0 0;color:#64748b;font-size:13px;">I typically respond faster during weekdays</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message Summary Card -->
              <div style="background:rgba(15,23,42,0.8);border:1px solid #1e293b;border-left:4px solid #10b981;border-radius:10px;padding:20px 22px;margin-bottom:8px;">
                <p style="margin:0 0 14px;color:#34d399;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">📋 &nbsp;Your Submission Summary</p>
                <table width="100%" cellpadding="6" cellspacing="0">
                  <tr>
                    <td style="color:#64748b;font-size:13px;width:80px;vertical-align:top;">Subject</td>
                    <td style="color:#e2e8f0;font-size:13px;font-weight:600;">${subject || "No Subject"}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:13px;vertical-align:top;">Sent by</td>
                    <td style="color:#e2e8f0;font-size:13px;">${name} &lt;${email}&gt;</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:13px;vertical-align:top;">Timestamp</td>
                    <td style="color:#e2e8f0;font-size:13px;">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:13px;vertical-align:top;">Status</td>
                    <td>
                      <span style="background:rgba(16,185,129,0.15);color:#34d399;font-size:12px;font-weight:700;padding:3px 10px;border-radius:12px;border:1px solid rgba(16,185,129,0.3);">✓ Received</span>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- ── ABOUT ME STRIP ── -->
          <tr>
            <td style="background:#0d1f35;padding:8px 40px 32px;border-left:1px solid #134e37;border-right:1px solid #134e37;">
              <div style="background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1));border:1px solid rgba(59,130,246,0.2);border-radius:14px;padding:28px;">

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- Avatar -->
                    <td style="width:64px;vertical-align:top;padding-right:16px;">
                      <div style="padding:3px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;display:inline-block;">
                        <img
                          src="https://ui-avatars.com/api/?name=K+S&background=1e40af&color=fff&size=58&bold=true&font-size=0.4"
                          alt="Kinshuk Saxena"
                          style="width:58px;height:58px;border-radius:50%;display:block;border:2px solid #0f172a;"
                        />
                      </div>
                    </td>
                    <!-- Info -->
                    <td style="vertical-align:top;">
                      <p style="margin:0 0 2px;color:#f1f5f9;font-size:18px;font-weight:700;">Kinshuk Saxena</p>
                      <p style="margin:0 0 10px;color:#64748b;font-size:13px;">Full Stack Developer &nbsp;|&nbsp; React Native Enthusiast &nbsp;|&nbsp; Music Lover 🎵</p>
                      <!-- Skill Tags -->
                      <div>
                        <span style="display:inline-block;background:rgba(59,130,246,0.2);color:#93c5fd;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid rgba(59,130,246,0.3);margin:2px 3px 2px 0;">⚛️ React</span>
                        <span style="display:inline-block;background:rgba(16,185,129,0.2);color:#6ee7b7;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid rgba(16,185,129,0.3);margin:2px 3px 2px 0;">🟢 Node.js</span>
                        <span style="display:inline-block;background:rgba(245,158,11,0.2);color:#fcd34d;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid rgba(245,158,11,0.3);margin:2px 3px 2px 0;">🍃 MongoDB</span>
                        <span style="display:inline-block;background:rgba(139,92,246,0.2);color:#c4b5fd;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid rgba(139,92,246,0.3);margin:2px 3px 2px 0;">🔷 TypeScript</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- ── CONNECT SECTION ── -->
          <tr>
            <td style="background:#0d1f35;padding:0 40px 36px;border-left:1px solid #134e37;border-right:1px solid #134e37;">

              <p style="margin:0 0 16px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;font-weight:700;text-align:center;">
                🚀 &nbsp;Connect With Me While You Wait
              </p>

              <!-- Badge Table — shields style -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <!-- GitHub -->
                  <td style="padding:0 5px 10px;">
                    <a href="https://github.com/kinshukkush" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:28px;">
                        <tr>
                          <td style="background:#555;padding:0 10px;height:28px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/25/25231.png" width="14" height="14" style="vertical-align:middle;filter:brightness(10);display:inline-block;" alt="gh"/>
                            <span style="color:#fff;font-size:11px;font-weight:700;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:5px;">GitHub</span>
                          </td>
                          <td style="background:#181717;padding:0 12px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">kinshukkush</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                  <!-- LinkedIn -->
                  <td style="padding:0 5px 10px;">
                    <a href="https://www.linkedin.com/in/kinshuk-saxena-/" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:28px;">
                        <tr>
                          <td style="background:#555;padding:0 10px;height:28px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/174/174857.png" width="14" height="14" style="vertical-align:middle;filter:brightness(10);display:inline-block;" alt="li"/>
                            <span style="color:#fff;font-size:11px;font-weight:700;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:5px;">LinkedIn</span>
                          </td>
                          <td style="background:#0077B5;padding:0 12px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">kinshuk-saxena</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <!-- Portfolio -->
                  <td style="padding:0 5px 10px;">
                    <a href="https://portfolio-frontend-mu-snowy.vercel.app/" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:28px;">
                        <tr>
                          <td style="background:#555;padding:0 10px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:13px;vertical-align:middle;">🌐</span>
                            <span style="color:#fff;font-size:11px;font-weight:700;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:5px;">Portfolio</span>
                          </td>
                          <td style="background:#FF5722;padding:0 12px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">Visit Website</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                  <!-- Email -->
                  <td style="padding:0 5px 10px;">
                    <a href="mailto:kinshuksaxena3@gmail.com" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:28px;">
                        <tr>
                          <td style="background:#555;padding:0 10px;height:28px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/732/732200.png" width="14" height="14" style="vertical-align:middle;filter:brightness(10);display:inline-block;" alt="mail"/>
                            <span style="color:#fff;font-size:11px;font-weight:700;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:5px;">Email</span>
                          </td>
                          <td style="background:#D14836;padding:0 12px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">Gmail</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                <tr>
                  <!-- Instagram -->
                  <td style="padding:0 5px 0;">
                    <a href="https://www.instagram.com/kinshuk._.saxena/" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:28px;">
                        <tr>
                          <td style="background:#555;padding:0 10px;height:28px;vertical-align:middle;">
                            <img src="https://cdn-icons-png.flaticon.com/128/174/174855.png" width="14" height="14" style="vertical-align:middle;filter:brightness(10);display:inline-block;" alt="ig"/>
                            <span style="color:#fff;font-size:11px;font-weight:700;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:5px;">Instagram</span>
                          </td>
                          <td style="background:linear-gradient(45deg,#e6683c,#cc2366);padding:0 12px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">kinshuk._.saxena</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                  <!-- Phone -->
                  <td style="padding:0 5px 0;">
                    <a href="tel:+919057538521" style="text-decoration:none;display:inline-block;">
                      <table cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;overflow:hidden;height:28px;">
                        <tr>
                          <td style="background:#555;padding:0 10px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:13px;vertical-align:middle;">📱</span>
                            <span style="color:#fff;font-size:11px;font-weight:700;font-family:DejaVu Sans,sans-serif;vertical-align:middle;margin-left:5px;">Phone</span>
                          </td>
                          <td style="background:#25D366;padding:0 12px;height:28px;vertical-align:middle;">
                            <span style="color:#fff;font-size:11px;font-family:DejaVu Sans,sans-serif;vertical-align:middle;">+91 90575 38521</span>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── CTA VISIT PORTFOLIO ── -->
          <tr>
            <td style="background:#0d1f35;padding:4px 40px 36px;text-align:center;border-left:1px solid #134e37;border-right:1px solid #134e37;">
              <a
                href="https://portfolio-frontend-mu-snowy.vercel.app/"
                style="display:inline-block;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#ffffff;padding:16px 48px;text-decoration:none;border-radius:10px;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 8px 24px rgba(16,185,129,0.3);"
              >
                🌐 &nbsp;&nbsp;Check Out My Portfolio
              </a>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#071120;padding:32px 40px;text-align:center;border:1px solid #134e37;border-radius:0 0 12px 12px;">

              <p style="margin:0 0 4px;color:#f1f5f9;font-size:18px;font-weight:700;">Kinshuk Saxena</p>
              <p style="margin:0 0 18px;color:#64748b;font-size:13px;">Full Stack Developer &nbsp;|&nbsp; React Native Enthusiast &nbsp;|&nbsp; Music Lover 🎵</p>

              <!-- Gradient Divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,#134e37,transparent);margin:0 0 18px;"></div>

              <p style="margin:0 0 6px;color:#64748b;font-size:13px;">
                Made with <span style="color:#ef4444;">❤️</span> and <span style="color:#a78bfa;">🎵</span> by <strong style="color:#6ee7b7;">Kinshuk Saxena</strong>
              </p>
              <p style="margin:0 0 16px;color:#1e3a5f;font-size:12px;">
                This is an automated response — I'll personally reply to you soon!
              </p>
              <p style="margin:0;color:#1e293b;font-size:11px;">
                © ${new Date().getFullYear()} Kinshuk Saxena. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- ── BOTTOM ACCENT BAR ── -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#10b981 0%,#3b82f6 50%,#8b5cf6 100%);border-radius:0 0 8px 8px;"></td>
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

