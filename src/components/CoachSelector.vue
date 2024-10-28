<template>
    <div class="coach-selector">
        <h3>Select a Coach</h3>
        <div v-if="loading">Loading coaches...</div>
        <div v-else>
            <ul>
                <li v-for="coach in coaches" :key="coach.id">
                    <h4>Coach Number: {{ coach.coachNumber }}</h4>
                    <button @click="$emit('selectCoach', coach)">Select Coach</button>
                </li>
            </ul>
            <div v-if="!coaches.length">No coaches available for this train.</div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useTrainStore } from '@/stores/trainStore';

export default {
    props: {
        trainId: String,
    },
    setup(props) {
        const trainStore = useTrainStore();
        const coaches = ref([]);
        const loading = ref(true);
        const error = ref(null);

        // Fetch coaches based on selected train
        const fetchCoaches = async () => {
            try {
                loading.value = true;
                coaches.value = await trainStore.fetchCoaches(props.trainId);
                
                if (!coaches.value.length) {
                    error.value = "No coaches found for this train.";
                }
            } catch (err) {
                console.error("Error fetching coaches:", err);
                error.value = "Failed to fetch coaches.";
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            fetchCoaches();
        });

        return {
            coaches,
            loading,
            error,
        };
    },
};
</script>

<style scoped>
.coach-selector {
    margin-top: 20px;
}
</style>