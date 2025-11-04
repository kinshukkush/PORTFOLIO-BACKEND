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
      subject: `New Contact Form Message: ${subject || "No Subject"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    });
    console.log("✅ Notification email sent to admin via Resend.");

    // ✅ Auto-reply to user
    await resend.emails.send({
      from: "Kinshuk Saxena <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for your message!",
      html: `
        <h2>Thank You!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out! I’ve received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br><strong>Kinshuk Saxena</strong></p>
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
