const express = require('express');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use Express's built-in JSON parser

// Email sending setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variable
        pass: process.env.EMAIL_PASS,   // Use environment variable
    },
});

// API endpoint to send email
app.post('/api/sendEmail', async (req, res) => {
    const { email, subject, body } = req.body;

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(body);

        const mailOptions = {
            from: process.env.EMAIL_USER, // Use environment variable
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h3>Booking Confirmation</h3>
                    <p>${body}</p>
                    <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 200px; height: auto;"/>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
