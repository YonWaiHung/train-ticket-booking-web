// src/stores/trainStore.js
import { defineStore } from 'pinia';
import { db } from '../firebase/init.js';
import { collection, addDoc, doc, getDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export const useTrainStore = defineStore('train', {
    state: () => ({
        schedules: [],
        unsubscribe: null, // To store and unsubscribe from the listener if needed
    }),
    getters: {
        // Extract unique stations from train schedules
        stations(state) {
            if (!state.schedules || state.schedules.length === 0) { // Use 'schedules' instead of 'trainSchedules'
                return []; // Return an empty array if schedules is not populated
            }
            const stationsSet = new Set();
            state.schedules.forEach(schedule => {
                stationsSet.add(schedule.from);
                stationsSet.add(schedule.to);
            });
            return Array.from(stationsSet);
        },
        // Check if a route exists between origin and destination
        routeExists: (state) => (origin, destination) => {
            return state.schedules.some( // Use 'schedules' instead of 'trainSchedules'
                schedule => schedule.from === origin && schedule.to === destination
            );
        },
    },
    actions: {
        // Initialize real-time listener for train schedules
        fetchSchedules() {
            // If there an existing listener, unsubscribe first to avoid duplicate listeners
            if (this.unsubscribe) {
                this.unsubscribe();
            }

            this.unsubscribe = onSnapshot(collection(db, 'trainSchedules'), (snapshot) => {
                console.log("Real-time data:", snapshot.docs.map(doc => doc.data()));
                this.schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            });
        },

        // Add a new schedule to Firestore
        async addSchedule(scheduleData) {
            await addDoc(collection(db, 'trainSchedules'), scheduleData);
        },

        // Update an existing schedule in Firestore
        async updateSchedule(id, scheduleData) {
            const scheduleRef = doc(db, 'trainSchedules', id);
            await updateDoc(scheduleRef, scheduleData);
        },

        // Delete a schedule from Firestore
        async deleteSchedule(id) {
            const scheduleRef = doc(db, 'trainSchedules', id);
            await deleteDoc(scheduleRef);
        },

        // Fetch trains based on route and date
        async fetchTrains(origin, destination, departureDate) {
            const filteredTrains = this.schedules.filter(schedule => {
                const departureDateObj = new Date(schedule.departure);
                return (
                    schedule.from === origin &&
                    schedule.to === destination &&
                    departureDateObj.toDateString() === new Date(departureDate).toDateString()
                );
            });
            return filteredTrains;
        },

        // Fetch coaches for a specific train
        async fetchCoaches(trainId) {
            const trainRef = doc(db, 'trainSchedules', trainId);
            const trainDoc = await getDoc(trainRef);
            return trainDoc.exists() ? trainDoc.data().coaches : [];
        },

        // Fetch seats for a specific coach
        async fetchSeats(trainId, coachNumber) {
            const trainRef = doc(db, 'trainSchedules', trainId);
            const trainDoc = await getDoc(trainRef);

            if (trainDoc.exists()) {
                const coaches = trainDoc.data().coaches;

                // Ensure coachNumber is valid
                if (coachNumber < 1 || coachNumber > coaches.length) {
                    console.error("Invalid coach number:", coachNumber);
                    return [];
                }

                return coaches[coachNumber - 1].seats;
            } else {
                console.error("Train document does not exist");
                return [];
            }
        },
    }
});
