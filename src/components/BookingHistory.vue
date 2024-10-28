<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Train Number</th>
                    <th>Departure Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="booking in bookings" :key="booking.bookingId">
                    <td>{{ booking.bookingId }}</td>
                    <td>{{ booking.trainNumber }}</td>
                    <td>{{ booking.departureDate }}</td>
                    <td>{{ booking.returnDate }}</td>
                    <td>{{ booking.status }}</td>
                    <td>
                        <button @click="viewBookingDetails(booking.bookingId)">View</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bookings: [],
        };
    },
    methods: {
        viewBookingDetails(bookingId) {
            // Logic to view details of a specific booking
        },
    },
    mounted() {
        // Fetch booking history for the user
    },
};
</script>

<style>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
    color: black;
}
</style>