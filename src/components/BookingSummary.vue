<template>
    <div class="booking-summary">
        <h2>Booking Summary</h2>
        <p>Train Number: {{ bookingDetails.trainNumber }}</p>
        <p>Origin: {{ bookingDetails.fromStation }}</p>
        <p>Destination: {{ bookingDetails.toStation }}</p>
        <p>Departure: {{ bookingDetails.departureTime }}</p>
        <p>Arrival: {{ bookingDetails.arrivalTime }}</p>
        <p>Coach: {{ bookingDetails.coach }}</p>
        <p>Seat Number: {{ bookingDetails.seatNumber }}</p>
        <p>Total Amount: ${{ bookingDetails.totalAmount }}</p>
        <button @click="confirmPayment">Confirm Payment</button>
    </div>
</template>

<script>
import axios from 'axios';
import QRCode from 'qrcode';
import { getAuth } from "firebase/auth";

export default {
    props: {
        bookingDetails: {
            type: Object,
            required: true
        }
    },
    methods: {
        async confirmPayment() {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert("Please log in to confirm your booking.");
                return;
            }

            const email = currentUser.email;

            // Prepare the email content
            const emailContent = `
                Booking Confirmation:
                Train Number: ${this.bookingDetails.trainNumber}
                Origin: ${this.bookingDetails.fromStation}
                Destination: ${this.bookingDetails.toStation}
                Departure: ${this.bookingDetails.departureTime}
                Arrival: ${this.bookingDetails.arrivalTime}
                Coach: ${this.bookingDetails.coach}
                Seat Number: ${this.bookingDetails.seatNumber}
                Total Amount: $${this.bookingDetails.totalAmount}
            `;

            try {
                const qrCodeDataUrl = await QRCode.toDataURL(emailContent);
                console.log('Generated QR Code Data URL:', qrCodeDataUrl);
                console.log('Content:', emailContent);
                await axios.post('http://localhost:3000/api/sendEmail', {
                    email,
                    subject: 'Train Booking Confirmation',
                    body: emailContent,
                    qrCode: qrCodeDataUrl
                });

                alert("Booking confirmed! An email has been sent with your booking details.");
                // Redirect to customer dashboard
                this.$router.push({ name: 'customerDashboard' }); 
            } catch (error) {
                console.error("Error sending email:", error);
                alert("Failed to send booking confirmation email. Please try again.");
            }
        }
    },
};
</script>

<style scoped>
.booking-summary {
    color: black;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #fafafa;
}
pre {
    white-space: pre-wrap;
    background: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
}
button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button:hover {
    background-color: #218838;
}
</style>
