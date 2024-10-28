<template>
    <div class="seat-selector">
        <h3>Select a Seat</h3>
        <div class="seat-grid">
            <button v-for="seat in seats" :key="seat.seatNumber"
                :class="{ 'booked': seat.status === 'booked', 'available': seat.status === 'available', 'pending': seat.status === 'pending' }"
                :disabled="pendingSeat && pendingSeat.seatNumber !== seat.seatNumber" @click="selectSeat(seat)">
                {{ seat.seatNumber }}
            </button>
        </div>
        <br>
        <div v-if="pendingSeat">
            <h2>Selected Seat: {{ pendingSeat.seatNumber }}</h2>
            <button @click="confirmSeat">Confirm Booking</button>
            <button @click="cancelSelection">Cancel</button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router'; 
import { useTrainStore } from '@/stores/trainStore';
import { useSeatStore } from '@/stores/seatStore';
import { onSnapshot, doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/init.js';
import { getAuth } from "firebase/auth";

export default {
    props: {
        trainId: String,
        trainNumber: String,
        coachNumber: Number,
        origin: String,
        destination: String,
        departureTime: String,
        arrivalTime: String,
    },
    setup(props) {
        const router = useRouter();
        const trainStore = useTrainStore();
        const seatStore = useSeatStore();
        const pendingSeat = ref(null);
        const seats = ref([]);
        const unsubscribe = ref(null);

        // Fetch seats based on selected coachNumber and trainId
        const fetchSeats = async () => {
            seats.value = await trainStore.fetchSeats(props.trainId, props.coachNumber);
        };

        // Real-time listener for seat status updates
        const startRealTimeListener = () => {
            const trainRef = doc(db, 'trainSchedules', props.trainId);
            unsubscribe.value = onSnapshot(trainRef, (snapshot) => {
                if (snapshot.exists()) {
                    const updatedSeats = snapshot.data().coaches[props.coachNumber - 1].seats;
                    seats.value = updatedSeats; // Update seats in real-time
                }
            });
        };

        onMounted(() => {
            fetchSeats();
            startRealTimeListener();
        });

        onUnmounted(() => {
            if (trainStore.unsubscribe) {
                trainStore.unsubscribe();
            }
            if (seatStore.unsubscribe) {
                seatStore.unsubscribe();
            }
        });

        watch([() => props.trainId, () => props.coachNumber], () => {
            if (unsubscribe.value) unsubscribe.value(); // Unsubscribe previous listener
            fetchSeats();
            startRealTimeListener(); // Start new listener
        });

        // Select a seat and mark it as pending
        const selectSeat = async (seat) => {
            if (seat.status === 'available') {
                // Mark seat as pending in Firestore to reflect for all users
                await seatStore.updateSeatStatus(props.trainId, props.coachNumber - 1, seat.seatNumber, 'pending');
                pendingSeat.value = seat;
            }
        };

        const confirmSeat = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (pendingSeat.value && currentUser) {
                await seatStore.updateSeatStatus(props.trainId, props.coachNumber - 1, pendingSeat.value.seatNumber, 'booked');

                const bookingDetails = {
                    userId: currentUser.uid,
                    trainNumber: props.trainNumber,
                    fromStation: props.origin,
                    toStation: props.destination,
                    departureTime: props.departureTime,
                    arrivalTime: props.arrivalTime,
                    coach: props.coachNumber,
                    seatNumber: pendingSeat.value.seatNumber,
                    totalAmount: 10.00,
                };

                try {
                    await addDoc(collection(db, 'bookings'), bookingDetails);
                } catch (error) {
                    console.error("Error adding booking: ", error);
                }
                pendingSeat.value = null;
                router.push({ name: 'bookingSummary', query: { bookingDetails: JSON.stringify(bookingDetails) } });
            }
        };

        const cancelSelection = async () => {
            if (pendingSeat.value) {
                await seatStore.updateSeatStatus(props.trainId, props.coachNumber - 1, pendingSeat.value.seatNumber, 'available');
                pendingSeat.value = null;
            }
        };

        return {
            seats,
            selectSeat,
            confirmSeat,
            cancelSelection,
            pendingSeat,
        };
    },
};
</script>

<style scoped>
.seat-selector {
    text-align: center;
}

.seat-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-top: 20px;
}

button {
    padding: 15px;
    font-size: 16px;
}

button.booked {
    background-color: red;
    color: white;
    cursor: not-allowed;
}

button.available {
    background-color: green;
    color: white;
    cursor: pointer;
}

button.pending {
    background-color: yellow;
    color: black;
}
</style>
