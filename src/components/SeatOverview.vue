<template>
    <div class="seat-overview">
        <h1>Seat Overview for Train {{ trainId }}</h1>

        <div v-for="(coach, coachIndex) in seatData" :key="coachIndex" class="coach">
            <h2>Coach {{ coach.coachNumber }}</h2>
            <div class="seat-grid">
                <button v-for="seat in coach.seats" :key="seat.seatNumber"
                    :class="{ 'booked': seat.status === 'booked', 'available': seat.status === 'available' }"
                    @click="toggleSeatStatus(coachIndex, seat)">
                    {{ seat.seatNumber }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useSeatStore } from '@/stores/seatStore';

export default {
    props: {
        trainId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const seatStore = useSeatStore();
        const seatData = computed(() => seatStore.seatData);

        // Watch for changes to trainId and fetch seats when it changes
        watch(
            () => props.trainId,
            async (newTrainId) => {
                if (newTrainId) {
                    // Fetch seats from the store based on the new train ID
                    console.log("Fetching seats for train ID:", newTrainId);  // Debug: train ID
                    await seatStore.fetchSeats(newTrainId);
                    // seatData.value = seatStore.seatData; // Update local seatData
                    console.log("Seat data:", seatData.value);
                }
            },
            { immediate: true }
        );
        // Toggle seat status between 'available' and 'booked'
        const toggleSeatStatus = async (coachIndex, seat) => {
            const newStatus = seat.status === 'available' ? 'booked' : 'available';
            await seatStore.updateSeatStatus(props.trainId, coachIndex, seat.seatNumber, newStatus);
            seat.status = newStatus; // Update status locally
        };

        return { seatData, toggleSeatStatus };

    },
};
</script>

<style scoped>
.seat-overview {
    text-align: center;
}

.coach {
    margin: 1em 0;
}

.seat-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

button.booked {
    background-color: red;
    color: white;
}

button.available {
    background-color: green;
    color: white;
}
</style>
