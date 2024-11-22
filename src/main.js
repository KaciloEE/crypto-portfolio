import "./assets/css/main.css";
import "./assets/css/media.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import App from "./App.vue";
import router from "./router";
import vuetify from "@/plugins/vuetify.js";
import env from "./env.js";

export const pinia = createPinia();

const app = createApp(App);

app.use(vuetify).use(pinia).use(router);

// Firebase
const firebaseConfig = {
  apiKey: env.FB_API_KEY,
  authDomain: env.FB_AUTH_DOMAIN,
  projectId: env.FB_PROJECT_ID,
  storageBucket: env.FB_STORAGE_BUCKET,
  messagingSenderId: env.FB_MESSAGING_SENDER_ID,
  appId: env.FB_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

import AuthFirebase from "@/services/auth.js";

const authFirebase = new AuthFirebase();

authFirebase.watcherAuthorizationAndRole();

app.mount("#app");
