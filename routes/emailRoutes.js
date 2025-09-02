const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");

// POST /api/email/send-to-role
router.post("/send-to-role", async (req, res) => {
  try {
    const { role, subject, message } = req.body;

    if (!role || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Get all active users with the role
    const users = await User.find({ role, status: "active" });
    if (!users.length) {
      return res.status(404).json({ error: "No users found for this role" });
    }

    // 2️⃣ Extract emails (trim + filter null)
    const emails = users.map(u => u.email?.trim()).filter(Boolean);
    if (!emails.length) {
      return res.status(400).json({ error: "No valid email addresses found" });
    }

   

    // 3️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER, // Gmail email
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    });

    // 4️⃣ Verify transporter (optional, helps debugging)
    await transporter.verify();
  

    // 5️⃣ Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,   // Must be same as authenticated user
      to: emails,                    // Nodemailer handles array automatically
      subject,
      text: message,
    });

    res.json({
      success: true,
      message: `✅ Email sent successfully to ${emails.length} ${role}(s)`,
    });

  } catch (error) {
    console.error("❌ Email sending error:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
});

module.exports = router;
