<template>
    <form @submit.prevent="signUp">
        <h2>Sign Up</h2>
        <input type="text" placeholder="Username" required v-model="username">
        <input type="email" placeholder="Email" required v-model="email">
        <input type="password" placeholder="Password" required v-model="password">
        <br>
        <input type="radio" value="User" id="user" required v-model="role">
        <label for="user">User</label>
        <input type="radio" value="Admin" id="admin" required v-model="role">
        <label for="admin">Admin</label>
        <br>
        <button>Sign Up</button>
    </form>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase/init.js'
import { doc, setDoc } from 'firebase/firestore'
import db from '../firebase/init.js'

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            role: '',
        }
    },
    methods: {
        async signUp() {
            try {
                // Register user
                const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

                // Get user UID
                const user = userCredential.user;

                // Update 'displayName'
                await updateProfile(user, { displayName: this.username });

                // Store the username in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    username: this.username,
                    email: this.email,
                    role: this.role,
                });

                // Emit event
                this.$emit('loggedIn');
            } catch (error) {
                console.error('Error signing up:', error);
            }
        }
    }
}
</script>