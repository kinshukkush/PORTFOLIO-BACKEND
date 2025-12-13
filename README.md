# 🚀 Portfolio Backend

A lightweight, production-ready Node.js backend powering a personal portfolio website.  
This backend handles **contact form submissions**, **email delivery**, and **API endpoints** to support seamless frontend portfolio interactions.

Built with simplicity, performance, and clean code in mind.

---

## ✨ Features

- 📩 **Contact Form API** – Receive and process messages from portfolio visitors
- ✉️ **Email Notifications** – Integrated email service using Resend API
- 🎨 **Custom Email Templates** – Professionally styled HTML email templates
- ⚡ **Fast & Lightweight** – Minimal Express.js setup for optimal performance
- 🔐 **Secure Configuration** – Environment-based secrets management
- 🌐 **CORS Enabled** – Cross-origin resource sharing for frontend integration
- ✅ **Input Validation** – Server-side validation for form data
- 🛡️ **Error Handling** – Comprehensive error management and logging

---

## 🛠️ Tech Stack

- **Node.js** (v14+)
- **Express.js** – Web framework
- **JavaScript (ES Modules)** – Modern JS syntax
- **Resend Email API** – Email delivery service
- **dotenv** – Environment variable management
- **CORS** – Cross-origin request handling

---

## 📁 Project Structure

```
PORTFOLIO-BACKEND/
├── server.js              # Main server & API logic
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── .env                   # Environment variables (not in repo)
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Resend API account ([sign up here](https://resend.com))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kinshukkush/PORTFOLIO-BACKEND.git
cd PORTFOLIO-BACKEND
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Resend Email API
RESEND_API_KEY=re_your_actual_api_key_here

# Email Addresses
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=your-email@gmail.com

# Frontend URL (for CORS)
FRONTEND_URL=https://yourportfolio.com
```

**Important Notes:**
- Get your Resend API key from [Resend Dashboard](https://resend.com/api-keys)
- `FROM_EMAIL` must be verified in your Resend account
- Add your actual domain or use Resend's testing domain

### 4️⃣ Run the Server

**Development Mode:**
```bash
npm start
```

**Production Mode:**
```bash
NODE_ENV=production npm start
```

Server will start at:
```
✅ Server running on http://localhost:5000
```

---

## 🔌 API Endpoints

### Send Contact Message

**Endpoint:** `POST /api/contact`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello! I loved your portfolio and would like to discuss a project."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message description"
}
```

**Field Validation:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `message`: Required, 10-1000 characters

---

## 📧 Email Template

The backend sends professionally formatted HTML emails with:
- ✅ Sender information (name & email)
- 💬 Message content
- 🎨 Responsive design
- 🔗 Social media links (optional)

---

## 🌐 Frontend Integration Example

```javascript
// React/JavaScript example
const sendContactMessage = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Message sent successfully!');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Usage
sendContactMessage({
  name: 'Jane Smith',
  email: 'jane@example.com',
  message: 'Great work on your projects!'
});
```

---

## 📦 Deployment

Deploy easily on popular platforms:

### Vercel
```bash
npm install -g vercel
vercel
```

### Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

### Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set RESEND_API_KEY=your_key
```

**⚠️ Important:** Always set environment variables in your deployment platform's dashboard.

---

## 🔒 Security Best Practices

- ✅ Never commit `.env` file to version control
- ✅ Use HTTPS in production
- ✅ Implement rate limiting (recommended: express-rate-limit)
- ✅ Add CORS whitelist for specific domains
- ✅ Validate and sanitize all user inputs
- ✅ Keep dependencies updated regularly

---

## 🧪 Testing

Test the API endpoint using curl:

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

Or use Postman/Insomnia for a GUI-based approach.

---

## 🐛 Troubleshooting

### Email Not Sending
- Verify your Resend API key is correct
- Check that `FROM_EMAIL` is verified in Resend
- Review server logs for error messages

### CORS Errors
- Ensure `FRONTEND_URL` matches your frontend domain
- Check CORS configuration in `server.js`

### Port Already in Use
```bash
# Change PORT in .env file or use:
PORT=3000 npm start
```

---

## 🛣️ Roadmap

- [ ] Add rate limiting middleware
- [ ] Implement request logging
- [ ] Add unit tests
- [ ] Create Docker container
- [ ] Add webhook support
- [ ] Integrate with multiple email providers

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Kinshuk Saxena**

- GitHub: [@kinshukkush](https://github.com/kinshukkush)
- Portfolio: [@portfolio-kinshuk](https://portfolio-frontend-mu-snowy.vercel.app/)
- LinkedIn: [@kinshuk-saxena-](https://www.linkedin.com/in/kinshuk-saxena-/)

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute.

---

## 🌟 Show Your Support

If this project helped you, give it a ⭐️ on GitHub!

---

## 📞 Support

For issues or questions:
- Open an [Issue](https://github.com/kinshukkush/PORTFOLIO-BACKEND/issues)
- Email: kinshuksaxena3@gmail.com

---

<div align="center">

**Made with ❤️ by Kinshuk Saxena**

[⬆ Back to Top](#-portfolio-backend)

</div>
