<template>
  <v-app>
    <HeaderLayout
      :is-logged-in="userStore.isLoggedIn"
      :user-email="userStore.getUserEmail"
      :user-role="userStore.getUserRoleText"
    >
      <template v-if="userStore.isLoggedIn" #logout>
        <div class="pa-2">
          <v-btn color="blue-accent-3" block @click="signOut"> Logout </v-btn>
        </div>
      </template>
    </HeaderLayout>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import { mapStores } from "pinia";

import HeaderLayout from "@/layouts/HeaderLayout.vue";
import { useUserStore } from "@/stores/auth.js";
import AuthFirebase from "@/services/auth.js";

export default {
  name: "App",
  components: {
    HeaderLayout,
  },
  data() {
    return {};
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    signOut() {
      const auth = new AuthFirebase();

      auth.signOut(this.$router);
    },
  },
};
</script>
