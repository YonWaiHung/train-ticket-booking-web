<template>
    <div class="customer-dashboard">
        <h1>Welcome To The Train</h1>
        <button @click="signOut">Sign Out</button>
        <section>
            <h2>Book Your Train</h2>
            <!-- Booking Form and available trains -->
            <TrainBookingForm />
        </section>

        <!-- <section>
            <h2>Your Booking History</h2>
            <BookingHistory :userId="userId" />
        </section> -->
    </div>
</template>


<script>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import TrainBookingForm from '@/components/TrainBookingForm.vue';
import BookingHistory from '@/components/BookingHistory.vue';

export default {
    components: {
        TrainBookingForm,
        BookingHistory
    },
    setup() {
        const userStore = useUserStore();
        // const userName = computed(() => userStore.userName);
        const userId = computed(() => userStore.userId);
        return { userId };
    },
    props: ['signOut'],
}
</script>

<style scoped>
.customer-dashboard {
  padding: 1em;
}
</style>