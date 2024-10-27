// src/stores/trainStore.js
import { defineStore } from 'pinia';
import { db } from '../firebase/init.js';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export const useTrainStore = defineStore('train', {
    state: () => ({
        schedules: [],
        unsubscribe: null, // To store and unsubscribe from the listener if needed
    }),
    actions: {
        // Initialize real-time listener for train schedules
        fetchSchedules() {
            // If there's an existing listener, unsubscribe first to avoid duplicate listeners
            if (this.unsubscribe) {
                this.unsubscribe();
            }

            // Real-time listener for changes in 'trainSchedules' collection
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
    }
});
