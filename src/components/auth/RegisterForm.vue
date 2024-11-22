<template>
  <section class="register-form-wrapper">
    <v-img
      class="mx-auto my-4"
      max-width="70"
      src="/src/assets/images/logo.png"
      alt="logo"
    ></v-img>
    <p class="text-h4 text-center font-weight-bold mb-2">Welcome!</p>
    <p class="text-h6 font-weight-regular text-center mb-8">
      Create a new account
    </p>

    <v-form
      ref="formRef"
      action="#"
      method="post"
      class="register-form"
      @submit.prevent="registration"
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
        Register
      </v-btn>

      <p class="text-center">
        Do you have an account?
        <RouterLink :to="{ name: 'login' }">
          <a href="#"> Sign in </a>
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

const registration = async () => {
  const valid = await validateForm();

  if (valid) {
    const auth = new AuthFirebase();

    auth.register(form.email, form.password, router, outputError);
  }
};
</script>
