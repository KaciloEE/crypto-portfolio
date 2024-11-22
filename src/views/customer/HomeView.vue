<template>
  <section class="home d-flex justify-center align-center flex-column h-100">
    <div class="home-img">
      <img src="/src/assets/images/logo.png" alt="logo" />
    </div>
    <p class="text-h4 font-weight-bold mb-2">Crypto Portfolio</p>
    <p class="text-h6 font-weight-regular mb-3">Start now</p>
    <v-btn color="blue-accent-3" @click="goToLogin"> Log in </v-btn>
  </section>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {};
  },
  methods: {
    goToLogin() {
      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>
