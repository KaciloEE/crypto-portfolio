import { mapStores } from "pinia";
import { reactive, ref } from "vue";

import { usePortfoliosStore } from "@/stores/portfolios.js";

export const useAuthForm = () => {
  const formRef = ref(null);

  const form = reactive({
    email: "",
    password: "",
  });

  const regexps = reactive({
    reEmail:
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
    rePassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/,
  });

  const emailRules = reactive([
    (v) => !!v || "Email is required",
    (v) => regexps.reEmail.test(v) || "Email is invalid",
  ]);

  const passwordRules = reactive([
    (v) => !!v || "Password is required",
    (v) =>
      (v && v.length >= 8 && v.length <= 16) ||
      "The password must have from 8 to 16 characters",
    (v) =>
      regexps.rePassword.test(v) ||
      "Requires one number, an uppercase letter, a lowercase letter, and a special character",
  ]);

  const serverError = ref("");

  const outputError = (error) => {
    const errorCode = error.code;

    let errorMessage;

    if (errorCode === "auth/invalid-email") {
      errorMessage = "Invalid email";
    } else if (errorCode === "auth/user-not-found") {
      errorMessage = "No account with that email was found";
    } else if (errorCode === "auth/wrong-password") {
      errorMessage = "Incorrect password";
    } else if (errorCode === "auth/email-already-in-use") {
      errorMessage = "Email address already in use";
    } else {
      errorMessage = "Email or password was incorrect";
    }

    serverError.value = errorMessage;
  };

  const validateForm = async () => {
    const { valid } = await formRef.value.validate();

    return valid;
  };

  return {
    formRef,
    form,
    emailRules,
    passwordRules,
    serverError,
    outputError,
    validateForm,
  };
};

export const portfolioForm = {
  data() {
    return {
      form: {
        name: "",
      },
      nameRules: [
        (v) => !!v || "The name cannot be empty",
        (v) =>
          (v && v.length >= 5 && v.length <= 16) ||
          "The name must have from 5 to 16 characters",
        (v) =>
          !this.portfoliosStore.includesName(v) ||
          "The name matches another portfolio",
      ],
      isLoading: false,
    };
  },
  computed: {
    ...mapStores(usePortfoliosStore),
  },
  methods: {
    async validateForm() {
      const { valid } = await this.$refs.form.validate();

      return valid;
    },
  },
};
