<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <h3>Import the functions you need from the SDKs you need</h3>
      <p>import { initializeApp } from "firebase/app";</p>
      <p>import { getAnalytics } from "firebase/analytics";</p>
    </div>
    <br>
    <div>
      <h3>TODO: Add SDKs for Firebase products that you want to use</h3>
      <a>https://firebase.google.com/docs/web/setup#available-libraries</a>
    </div>
    <br>
    <div>
      <h3>Your web app's Firebase configuration</h3>
      <h3>For Firebase JS SDK v7.20.0 and later, measurementId is optional</h3>
      <p>const firebaseConfig = {
          apiKey: "AIzaSyA1_U5GRgn0hAcIe7VUfKIhccUsaywod8I",
          authDomain: "train-ticket-booking-41371.firebaseapp.com",
          projectId: "train-ticket-booking-41371",
          storageBucket: "train-ticket-booking-41371.appspot.com",
          messagingSenderId: "210171112308",
          appId: "1:210171112308:web:7f6654046e59e6c0e21a21",
          measurementId: "G-3NQMWS1YCX"
        };</p>
    </div>
    <br>
    <div>
      <h3>Initialize Firebase</h3>
      <p>const app = initializeApp(firebaseConfig);</p>
      <p>const analytics = getAnalytics(app);</p>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
