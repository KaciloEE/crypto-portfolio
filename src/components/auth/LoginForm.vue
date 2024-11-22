<template>
  <section class="login-form-wrapper">
    <v-img
      class="mx-auto my-4"
      max-width="70"
      src="/src/assets/images/logo.png"
      alt="logo"
    ></v-img>
    <p class="text-h4 text-center font-weight-bold mb-2">Welcome back!</p>
    <p class="text-h6 font-weight-regular text-center mb-8">
      Log into your account
    </p>

    <v-form
      ref="formRef"
      action="#"
      method="post"
      class="login-form"
      @submit.prevent="authorization"
    >
      <v-text-field
        v-model="form.email"
        class="mb-2"
        label="Email"
        type="email"
        :rules="emailRules"
        variant="outlined"
        required
      >
      </v-text-field>
      <v-text-field
        v-model="form.password"
        class="mb-2"
        label="Password"
        type="password"
        :rules="passwordRules"
        variant="outlined"
        required
      >
      </v-text-field>

      <p class="text-red text-center mb-1">
        {{ serverError }}
      </p>

      <v-btn class="mb-3" type="submit" block color="blue-accent-3">
        Log in
      </v-btn>

      <p class="text-center">
        Don't have an account?
        <RouterLink :to="{ name: 'register' }">
          <a href="#"> Sign up </a>
        </RouterLink>
      </p>
    </v-form>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";

import { useAuthForm } from "@/mixins/form.js";
import AuthFirebase from "@/services/auth.js";

const {
  formRef,
  form,
  emailRules,
  passwordRules,
  serverError,
  outputError,
  validateForm,
} = useAuthForm();

const router = useRouter();

const authorization = async () => {
  const valid = await validateForm();

  if (valid) {
    const auth = new AuthFirebase();

    auth.login(form.email, form.password, router, outputError);
  }
};
</script>
