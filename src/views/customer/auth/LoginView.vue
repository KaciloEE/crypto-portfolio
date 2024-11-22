<template>
  <section class="login-view">
    <LoginForm />
  </section>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue";

export default {
  name: "LoginView",
  components: { LoginForm },
};
</script>
