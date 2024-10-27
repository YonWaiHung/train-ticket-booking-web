// src/stores/seatStore.js
import { defineStore } from 'pinia';
import { db } from '../firebase/init.js';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';

export const useSeatStore = defineStore('seat', {
    state: () => ({
        seatData: [], // Array of coaches, each with seat info
    }),
    actions: {
        // Fetch seats with real-time updates for a specific train
        async fetchSeats(trainId) {
            if (!trainId) {
                console.error("Error: trainId is undefined or empty");
                return;
            }

            const trainDoc = doc(db, 'trainSchedules', trainId);
            this.unsubscribe = onSnapshot(trainDoc, (snapshot) => {
                if (snapshot.exists()) {
                    this.seatData = snapshot.data().coaches || [];
                    console.log("Fetched seat data:", this.seatData);  // Debug: log seat data
                } else {
                    console.error("Error: Document does not exist");
                }
            });
        },

        // Update seat status in Firestore
        async updateSeatStatus(trainId, coachIndex, seatNumber, newStatus) {
            const trainRef = doc(db, 'trainSchedules', trainId);
            const trainDoc = await getDoc(trainRef);
            if (trainDoc.exists()) {
                const coaches = trainDoc.data().coaches;

                // coaches[coachIndex][seatNumber - 1].status = newStatus; // Assuming seats are indexed
                // await updateDoc(trainRef, { coaches });

                const seat = coaches[coachIndex].seats.find(seat => seat.seatNumber === seatNumber);
                if (seat) {
                    seat.status = newStatus; // Update the seat status
                    await updateDoc(trainRef, { coaches });
                } else {
                    console.error("Seat not found:", seatNumber);
                }
            } else {
                console.error("Train document does not exist");
            }
        },
    }
});
