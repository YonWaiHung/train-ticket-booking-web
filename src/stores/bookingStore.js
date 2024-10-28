import { defineStore } from 'pinia';
import { db } from '../firebase/init.js';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';

export const useBookingStore = defineStore('booking', {
    state: () => ({
        bookingDetails: {},
    }),
    actions: {
        saveBookingDetails(details) {
            this.bookingDetails = details;
        },
    },
});
