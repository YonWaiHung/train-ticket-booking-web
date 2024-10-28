<template>
    <div class="train-list">
        <button @click="goBack" class="back-button">Back to Dashboard</button>
        <h2>Available Trains</h2>
        <div v-if="loading">Loading trains...</div>
        <div v-else>
            <ul v-if="trains.length">
                <li v-for="train in trains" :key="train.id">
                    <h2>{{ train.trainNumber }}</h2>
                    <h2>From {{ train.departure }} to {{ train.arrival }}</h2>
                    <button @click="selectTrain(train.id)">Select Train</button>
                </li>
            </ul>
            <div v-else>No trains available for the selected route.</div>
        </div>

        <div v-if="selectedTrain">
            <h2>Selected Train: {{ selectedTrain.trainNumber }}</h2>
            <CoachSelector :trainId="selectedTrain.id" @selectCoach="selectCoach" />
        </div>

        <div v-if="selectedCoach">
            <h2>Selected Coach: {{ selectedCoach.coachNumber }}</h2>
            <SeatSelector 
            :trainId="selectedTrain.id" 
            :trainNumber="selectedTrain.trainNumber"
            :coachNumber="selectedCoach.coachNumber"
            :origin="origin"
            :destination="destination"
            :departureTime="departureDate"
            :arrivalTime="selectedTrain.arrival" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTrainStore } from '@/stores/trainStore';
import CoachSelector from './CoachSelector.vue';
import SeatSelector from './SeatSelector.vue';
import { useRouter } from 'vue-router';

export default {
    props: {
        origin: String,
        destination: String,
        departureDate: String,
    },
    components: {
        CoachSelector, SeatSelector
    },
    setup(props) {
        const router = useRouter();
        const trainStore = useTrainStore();
        const trains = ref([]);
        const loading = ref(true);
        const selectedTrain = ref(null);
        const selectedCoach = ref(null);

        // Fetch trains based on selected route and date
        const fetchTrains = async () => {
            loading.value = true;
            trains.value = await trainStore.fetchTrains(props.origin, props.destination, props.departureDate);
            loading.value = false;
        };

        onMounted(() => {
            fetchTrains();
        });

        onUnmounted(() => {
            if (trainStore.unsubscribe) {
                trainStore.unsubscribe();
            }
        });

        // Go back to the customer dashboard
        const goBack = () => {
            router.push({ path: '/customer-dashboard' });
        };

        const selectTrain = (trainId) => {
            selectedTrain.value = trains.value.find(train => train.id === trainId);
        };

        const selectCoach = (coach) => {
            selectedCoach.value = coach;
        };

        return {
            goBack,
            trains,
            loading,
            selectedTrain,
            selectedCoach,
            selectTrain,
            selectCoach,
        };
    },
};
</script>

<style scoped>
.train-info {
    max-width: 600px;
    margin: auto;
}
</style>