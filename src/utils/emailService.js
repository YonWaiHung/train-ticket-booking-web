import QRCode from 'qrcode';
import axios from 'axios';

export const sendEmailWithQRCode = async (email, content) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(content); 

        // Send the email via your API
        await axios.post('http://localhost:3000/api/sendEmail', {
            email,
            subject: 'Booking Confirmation',
            body: content,
        });
        
        console.log('Email sent with QR code');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
