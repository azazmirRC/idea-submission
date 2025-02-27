const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (unchanged)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Existing Routes (unchanged)
const ideasRoutes = require("./routes/ideaRoutes");
app.use("/api", ideasRoutes);

// ✅ Email Verification Storage (Temporary)
let verificationCodes = {};


const transporter = nodemailer.createTransport({
  host: "mail.royalcyber.org", // Your company's SMTP server
  port: 465, // Secure SSL port
  secure: true, // Use SSL (port 465 requires this to be true)
  auth: {
    user: process.env.SMTP_EMAIL, // Your company email (e.g., digitalagentpoc@royalcyber.org)
    pass: process.env.SMTP_PASSWORD, // Your email password
  },
});



// Serve static files from the uploads directory
app.use("/uploads", (req, res, next) => {
  console.log(`Serving file: ${req.path}`);
  next();
}, express.static(path.join(__dirname, "uploads")));


// ✅ Route to Send Verification Code
app.post("/api/send-verification-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Generate a 6-digit random code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  verificationCodes[email] = { code: verificationCode, expiresAt: Date.now() + 120000 }; // Expires in 2 mins

  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}. It will expire in 2 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

// ✅ Route to Verify the Code
app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

  const record = verificationCodes[email];
  if (!record) return res.status(400).json({ error: "No verification code found for this email" });
  if (Date.now() > record.expiresAt) return res.status(400).json({ error: "Verification code expired" });
  if (parseInt(code) !== record.code) return res.status(400).json({ error: "Invalid verification code" });

  delete verificationCodes[email]; // Remove after successful verification
  res.status(200).json({ message: "Email verified successfully" });
});

// ✅ Test Route (unchanged)
app.get("/", (req, res) => {
  res.send("Backend is running! Use API routes like /api/ideas");
});

// ✅ Start Server (unchanged)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
