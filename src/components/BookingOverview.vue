<template>
    <div class="booking-management">
        <h1>Booking Management</h1>
        <div v-if="loading">Loading bookings...</div>
        <div v-else>
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>User Email</th>
                        <th>Train Number</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="booking in bookings" :key="booking.id">
                        <td>{{ booking.id }}</td>
                        <td>{{ booking.userEmail }}</td>
                        <td>{{ booking.trainNumber }}</td>
                        <td>{{ formatDate(booking.departureTime) }}</td>
                        <td>{{ formatDate(booking.arrivalTime) }}</td>
                        <td>{{ booking.status }}</td>
                        <td>
                            <button @click="deleteBooking(booking.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/init';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default {
    name: 'BookingManagement',

    setup() {
        const bookings = ref([]);
        const loading = ref(true);

        // Fetch bookings and listen for real-time updates
        const fetchBookings = () => {
            const bookingsRef = collection(db, 'bookings');
            onSnapshot(bookingsRef, (snapshot) => {
                bookings.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            });
        };

        const formatDate = (timestamp) => {
            const date = timestamp.toDate(); // Convert Firestore Timestamp to Date
            return date.toLocaleString(); // Format the date as a string
        };

        const deleteBooking = async (bookingId) => {
            try {
                await deleteDoc(doc(db, 'bookings', bookingId));
                console.log(`Booking ${bookingId} deleted successfully`);
            } catch (error) {
                console.error('Error deleting booking:', error);
            }
        };

        onMounted(() => {
            fetchBookings(); // Fetch bookings when the component is mounted
            loading.value = false; // Stop loading once fetch is set up
        });

        return { bookings, formatDate, deleteBooking, loading };
    }
};
</script>

<style scoped>
/* .booking-management {
    padding: 20px;
} */

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