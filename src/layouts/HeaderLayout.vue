<template>
  <v-app-bar class="header-bar" color="blue-accent-3">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-toolbar-title class="header-bar-title" @click="goToHome">
      Crypto Portfolio
    </v-toolbar-title>
  </v-app-bar>

  <v-navigation-drawer
    class="header-drawer"
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
  >
    <v-list v-if="isLoggedIn">
      <v-list-item
        class="header-drawer-auth-info"
        prepend-avatar="/src/assets/images/user-default.png"
        :title="userEmail"
        :subtitle="userRole"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list class="header-drawer-menu size" density="compact" nav>
      <template v-if="isLoggedIn">
        <v-list-item
          prepend-icon="mdi-widgets"
          title="Portfolios management"
          value="portfolios-management"
          @click="goToPortfoliosManagement"
        >
        </v-list-item>

        <v-list-item
          v-for="portfolio in portfolios"
          :key="portfolio.id"
          :title="portfolio.name"
          :value="portfolio.name"
          @click="goToPortfolio(portfolio.id)"
        >
          <template #prepend>
            <img
              src="@/assets/images/work.png"
              alt="work"
              class="portfolio-form-prepend-img"
            />
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-item
          prepend-icon="mdi-login"
          title="Login / Register"
          value="login"
          @click="goToLogin"
        >
        </v-list-item>
      </template>
    </v-list>

    <template #append>
      <slot name="logout"> </slot>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapStores } from "pinia";
import { usePortfoliosStore } from "@/stores/portfolios.js";

export default {
  name: "HeaderLayout",
  props: {
    isLoggedIn: Boolean,
    userEmail: String,
    userRole: String,
  },
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    ...mapStores(usePortfoliosStore),
    portfolios() {
      return this.portfoliosStore.getData;
    },
  },
  methods: {
    goToHome() {
      this.$router.push({
        name: "home",
      });
    },
    goToLogin() {
      this.$router.push({
        name: "login",
      });
    },
    goToPortfoliosManagement() {
      this.$router.push({
        name: "portfolios-management",
      });
    },
    goToPortfolio(portfolioId) {
      this.$router.push({
        name: "portfolio",
        params: {
          id: portfolioId,
        },
      });
    },
  },
};
</script>
