<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <button @click="signOut">Sign Out</button>
    <section>
      <h2>Manage Train Schedules</h2>
      <TrainScheduleManager @select-train="handleTrainSelection" />
      <SeatOverview v-if="selectedTrainId" :trainId="selectedTrainId" />
    </section>

    <!-- <section>
        <h2>Manage Train Seats</h2>
        <SeatOverview />
      </section> -->

    <section>
      <h2>Current Bookings</h2>
      <BookingOverview />
    </section>

    <!-- <section>
      <h2>User Management</h2>
      <UserManagement />
    </section> -->
  </div>
</template>


<script>
import { signOut } from 'firebase/auth'
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import TrainScheduleManager from '@/components/TrainScheduleManager.vue'
import SeatOverview from '@/components/SeatOverview.vue'
import BookingOverview from '@/components/BookingOverview.vue'
import UserManagement from '@/components/UserManagement.vue'

export default {
  name: "adminDashboard",
  props: ['signOut'],
  components: {
    TrainScheduleManager,
    SeatOverview,
    BookingOverview,
    UserManagement
  },
  methods: {
    handleTrainSelection(trainId) {
      this.selectedTrainId = trainId;
    },
  },
  data() {
    return {
      selectedTrainId: null,
    }
  },
  setup() {
    const userStore = useUserStore();
    const adminName = computed(() => userStore.userName);

    return { adminName };
  },
}
</script>

<style scoped>
.admin-dashboard {
  padding: 1em;
}
</style>