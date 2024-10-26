<template>
  <div v-if="!isLoggedIn">
    <!-- login -->
    <template v-if="showLogin">
      <login-form @loggedIn="isLoggedIn = true"/>
      <p>No account yet? <span @click="showLogin = false">Sign up</span> instead.</p>
    </template>
    <!-- or register -->
    <template v-else>
      <signup-form @loggedIn="isLoggedIn = true"/>
      <p>Already registered? <span @click="showLogin = true">Login</span> instead.</p>
    </template>
  </div>
  <!-- is logged in -->
  <div v-else>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld :msg="displayName" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <button @click="signOut">Sign Out</button>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { auth } from './firebase/init.js'
import { signOut } from 'firebase/auth'
import HelloWorld from './components/HelloWorld.vue'
import SignupForm from './components/SignupForm.vue'
import LoginForm from './components/LoginForm.vue'

export default {
  components: { SignupForm, LoginForm, HelloWorld },
  data() {
    return {
      isLoggedIn: false,
      showLogin: true,
      displayName: ''
    }
  },
  created() {
    // Check if the user is logged in on load
    this.isLoggedIn = !!auth.currentUser;
    if (this.isLoggedIn && auth.currentUser) {
      this.displayName = auth.currentUser.displayName;
    }
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal && auth.currentUser) {
        // Update displayName when user logs in
        this.displayName = auth.currentUser.displayName;
      }
    }
  },
  methods: {
    signOut() {
      signOut(auth)
      .then(() => {
        // user signed-out
        this.isLoggedIn = false
      })
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
