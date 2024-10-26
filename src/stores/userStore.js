// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: '',
    userId: '',
    role: '', // "user" or "admin"
  }),
  actions: {
    setUser(userData) {
      this.userName = userData.userName;
      this.userId = userData.userId;
      this.role = userData.role;
    },
    clearUser() {
      this.userName = '';
      this.userId = '';
      this.role = '';
    }
  }
});
