const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
// Make sure to have MONGODB_URI in your .env file
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema for Contact Form Submissions
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

// --- Nodemailer Transporter Setup ---
// This transporter uses Gmail. You'll need to set up an "App Password"
// for your Google Account if you have 2-Step Verification enabled.
// CORRECTED LINE: The function is createTransport, not createTransporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address from .env file
        pass: process.env.EMAIL_APP_PASSWORD // Your Gmail App Password from .env file
    }
});

// Verify that the transporter is ready
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email server connection error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});


// --- API Endpoint for Form Submission ---
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // 1. Validate incoming data
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields (Name, Email, Message).'
            });
        }

        // 2. Save the submission to the MongoDB database
        const newContact = new Contact({
            name,
            email,
            subject: subject || 'No Subject', // Provide a default subject if none is given
            message
        });

        await newContact.save();
        console.log('✅ Contact form data saved to database.');

        // 3. Prepare and send an email notification to yourself
        const mailOptionsToAdmin = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender's name and your email
            to: 'kinshuksaxena3@gmail.com', // Your email address where you want to receive notifications
            replyTo: email, // So you can reply directly to the user
            subject: `New Contact Form Message: ${subject || 'No Subject'}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                    .header { background-color: #4F46E5; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { padding: 20px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #555; }
                    .value { margin-top: 5px; padding: 10px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 3px; }
                    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header"><h2>New Contact Form Submission</h2></div>
                    <div class="content">
                      <div class="field"><div class="label">Name:</div><div class="value">${name}</div></div>
                      <div class="field"><div class="label">Email:</div><div class="value"><a href="mailto:${email}">${email}</a></div></div>
                      <div class="field"><div class="label">Subject:</div><div class="value">${subject || 'No Subject'}</div></div>
                      <div class="field"><div class="label">Message:</div><div class="value">${message.replace(/\n/g, '<br>')}</div></div>
                    </div>
                    <div class="footer"><p>This message was sent from your portfolio contact form.</p></div>
                  </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptionsToAdmin);
        console.log('✅ Notification email sent to admin.');

        // 4. Prepare and send an auto-reply email to the user
        const autoReplyOptions = {
            from: `"Kinshuk Saxena" <${process.env.EMAIL_USER}>`, // Your name and email
            to: email, // The user's email address
            subject: 'Thank you for your message!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                    .header { background-color: #4F46E5; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { padding: 20px; text-align: left; }
                    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header"><h2>Thank You!</h2></div>
                    <div class="content">
                      <p>Hi ${name},</p>
                      <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
                      <p>Best regards,<br>Kinshuk Saxena</p>
                    </div>
                    <div class="footer"><p>This is an automated reply. Please do not reply to this email.</p></div>
                  </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(autoReplyOptions);
        console.log(`✅ Auto-reply email sent to ${email}.`);

        // 5. Send a success response to the frontend
        res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error('❌ Error processing contact form:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
