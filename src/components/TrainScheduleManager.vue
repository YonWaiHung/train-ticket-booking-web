<template>
    <div class="train-schedule-manager">
        <h1>Train Schedule Manager</h1>

        <!-- Form to Add/Edit Train Schedule -->
        <section>
            <h2>{{ isEditing ? 'Edit Train Schedule' : 'Add New Train Schedule' }}</h2>
            <form @submit.prevent="submitSchedule">
                <input v-model="trainNumber" type="text" placeholder="Train Number" required />
                <input v-model="departure" type="datetime-local" placeholder="Departure Time" required />
                <input v-model="arrival" type="datetime-local" placeholder="Arrival Time" required />
                <input v-model="from" type="text" placeholder="From Station" required />
                <input v-model="to" type="text" placeholder="To Station" required />
                <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Schedule</button>
            </form>
        </section>

        <!-- List of Existing Train Schedules -->
        <section>
            <h2>Existing Schedules</h2>
            <table>
                <thead>
                    <tr>
                        <th>Train Number</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="schedule in schedules" :key="schedule.id">
                        <td>{{ schedule.trainNumber }}</td>
                        <td>{{ schedule.from }}</td>
                        <td>{{ schedule.to }}</td>
                        <td>{{ schedule.departure }}</td>
                        <td>{{ schedule.arrival }}</td>
                        <td>
                            <button @click="selectTrain(schedule.id)">Select</button>
                            <button @click="editSchedule(schedule)">Edit</button>
                            <button @click="deleteSchedule(schedule.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTrainStore } from '@/stores/trainStore';

export default {
    setup(_, { emit }) {
        const trainStore = useTrainStore();

        // Form data for train schedule
        const trainNumber = ref('');
        const departure = ref('');
        const arrival = ref('');
        const from = ref('');
        const to = ref('');
        const isEditing = ref(false);
        const editId = ref(null);

        // Fetch schedules when component mounts
        onMounted(() => {
            console.log('Fetching schedules on mount');
            trainStore.fetchSchedules();
        });

        onUnmounted(() => {
            if (trainStore.unsubscribe) {
                trainStore.unsubscribe();
            }
        });

        const schedules = computed(() => trainStore.schedules);

        const submitSchedule = async () => {
            const numCoaches = 6;
            const seatsPerCoach = 20;

            // Generate default coaches data with seats
            const coaches = Array.from({ length: numCoaches }, (_, coachIndex) => ({
                coachNumber: coachIndex + 1,
                seats: Array.from({ length: seatsPerCoach }, (__, seatIndex) => ({
                    seatNumber: seatIndex + 1,
                    status: 'available'
                }))
            }));

            const scheduleData = {
                trainNumber: trainNumber.value,
                departure: departure.value,
                arrival: arrival.value,
                from: from.value,
                to: to.value,
                coaches: coaches,
            };

            if (isEditing.value) {
                await trainStore.updateSchedule(editId.value, scheduleData);
            } else {
                await trainStore.addSchedule(scheduleData);
            }

            resetForm();
        };

        const selectTrain = (trainId) => {
            emit('select-train', trainId); // Emit the selected train ID
        };

        const editSchedule = (schedule) => {
            isEditing.value = true;
            editId.value = schedule.id;
            trainNumber.value = schedule.trainNumber;
            departure.value = schedule.departure;
            arrival.value = schedule.arrival;
            from.value = schedule.from;
            to.value = schedule.to;
        };

        const deleteSchedule = async (id) => {
            await trainStore.deleteSchedule(id);
        };

        const resetForm = () => {
            trainNumber.value = '';
            departure.value = '';
            arrival.value = '';
            from.value = '';
            to.value = '';
            isEditing.value = false;
            editId.value = null;
        };

        return {
            trainNumber,
            departure,
            arrival,
            from,
            to,
            schedules,
            isEditing,
            submitSchedule,
            selectTrain,
            editSchedule,
            deleteSchedule,
        };
    },
};
</script>

<style scoped>
.train-schedule-manager {
    max-width: 800px;
    margin: auto;
}

form {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border: 1px solid #ddd;
}

button {
    margin-right: 5px;
}
</style>
