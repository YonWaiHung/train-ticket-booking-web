<template>
    <form @submit.prevent="login">
        <h2>Log in</h2>
        <input type="email" placeholder="Email" required v-model="email">
        <input type="password" placeholder="Password" required v-model="password">
        <button>Log in</button>
    </form>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase/init.js'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '../stores/userStore'

export default {
    name: "Login",
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        async login() {
            const userStore = useUserStore();
            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);

                // Get the user UID
                const user = userCredential.user;

                // Retrieve username from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // const username = userData.username;

                    // Update the displayName in Auth
                    // await updateProfile(user, { displayName: username });

                    userStore.setUser({
                        userName: userData.username,
                        userId: user.uid,
                        role: userData.role
                    });

                    // Emit loggedIn event or handle successful login
                    this.$emit('loggedIn');
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        }
    }
}
</script>