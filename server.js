import express from 'express';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Use Express's built-in JSON parser

// Email sending setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,   
    },
});

// API endpoint to send email
app.post('/api/sendEmail', async (req, res) => {
    const { email, subject, body, qrCode } = req.body;

    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Body:', body); 
    console.log('QR Code Data URL:', qrCode);

    try {
        const qrCodePattern = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/;
        if (!qrCode || !qrCodePattern.test(qrCode)) {
            return res.status(400).send('Invalid QR code');
        }

        // const qrCodeDataUrl = await QRCode.toDataURL(body);

        const mailOptions = {
            from: process.env.EMAIL_USER, // Use environment variable
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h3>Train Booking Confirmation</h3>
                    <p>${body}</p>
                    <img src="${qrCode}" alt="Booking Summary QR Code" style="width: 200px; height: auto;"/>
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
