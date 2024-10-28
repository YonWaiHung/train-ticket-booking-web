<template>
    <div class="train-booking-form">
        <form @submit.prevent="submitBooking">
            <label for="origin">Origin:</label>
            <select v-model="origin" @change="validateRoute" required>
                <option disabled value="">Select Origin</option>
                <option v-for="station in stations" :key="station" :value="station">
                    {{ station }}
                </option>
            </select>

            <label for="destination">Destination:</label>
            <select v-model="destination" @change="validateRoute" required>
                <option disabled value="">Select Destination</option>
                <option v-for="station in availableDestinations" :key="station" :value="station">
                    {{ station }}
                </option>
            </select>

            <label for="departure-date">Departure Date:</label>
            <select v-model="departureDate" @change="validateDates" required>
                <option disabled value="">Select Departure Date</option>
                <option v-for="date in availableDepartureDates" :key="date" :value="date">
                    {{ date }}
                </option>
            </select>

            <label for="return-date">Return Date:</label>
            <input type="date" v-model="returnDate" :min="minReturnDate" required />
            <br>
            <button type="submit" :disabled="!isFormValid">Book</button>
        </form>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useTrainStore } from '@/stores/trainStore';

export default {
    setup() {
        const trainStore = useTrainStore();
        const router = useRouter();

        // Form data
        const origin = ref('');
        const destination = ref('');
        const departureDate = ref('');
        const returnDate = ref('');
        const minReturnDate = ref(''); // For dynamically setting minimum return date
        const isFormValid = ref(false);

        // Fetch stations and routes on mount
        onMounted(async () => {
            await trainStore.fetchSchedules();
        });

        // Watch for changes in the trainStore's schedules to derive unique stations
        const stations = computed(() => {
            const uniqueStations = new Set();
            trainStore.schedules.forEach(schedule => {
                uniqueStations.add(schedule.from);
                uniqueStations.add(schedule.to);
            });
            return Array.from(uniqueStations);
        });

        // Filter available destinations based on selected origin
        const availableDestinations = computed(() => {
            return trainStore.schedules
                .filter(schedule => schedule.from === origin.value)
                .map(schedule => schedule.to);
        });

        const availableDepartureDates = computed(() => {
            return trainStore.schedules
                .filter(schedule => schedule.from === origin.value && schedule.to === destination.value)
                .map(schedule => schedule.departure); // Ensure 'departure' is the correct field name
        });

        // Validate origin and destination route
        const validateRoute = () => {
            if (origin.value && destination.value) {
                // Ensure origin and destination are not the same
                if (origin.value === destination.value) {
                    alert('Origin and destination cannot be the same.');
                    destination.value = '';
                }
            }
            validateForm();
        };

        // Validate dates
        const validateDates = () => {
            if (departureDate.value) {
                // Fetch the selected schedule to get the arrival date for the return date validation
                const selectedSchedule = trainStore.schedules.find(
                    schedule => schedule.from === origin.value && schedule.to === destination.value
                );

                if (selectedSchedule) {
                    const arrivalDate = new Date(selectedSchedule.arrival);
                    minReturnDate.value = arrivalDate.toISOString().split('T')[0];

                    if (returnDate.value && new Date(returnDate.value) < arrivalDate) {
                        alert('Return date must be after the arrival date.');
                        returnDate.value = '';
                    }
                }
            }
            validateForm();
        };

        // Form validation
        const validateForm = () => {
            isFormValid.value = origin.value && destination.value && departureDate.value && (!returnDate.value || new Date(returnDate.value) >= new Date(minReturnDate.value));
        };

        const submitBooking = () => {
            // Handle booking logic here
            router.push({
                path: '/train-list',
                query: {
                    origin: origin.value,
                    destination: destination.value,
                    departureDate: departureDate.value,
                },
            });
        };

        return {
            origin,
            destination,
            departureDate,
            returnDate,
            stations,
            availableDestinations,
            availableDepartureDates,
            minReturnDate,
            isFormValid,
            validateRoute,
            validateDates,
            submitBooking
        };
    }
};
</script>

<style scoped>
.train-booking-form {
    max-width: 500px;
    margin: auto;
}

label {
    display: block;
    margin: 10px 0 5px;
}

button {
    margin-top: 20px;
    padding: 10px;
    font-size: 16px;
}
</style>