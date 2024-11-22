import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/auth.js";
import { pinia } from "@/main.js";
import AuthFirebase from "@/services/auth.js";
import { usePortfoliosStore } from "@/stores/portfolios.js";
import { Portfolios } from "@/services/database.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/customer/HomeView.vue"),
    },
    {
      path: "/user/login",
      name: "login",
      component: () => import("@/views/customer/auth/LoginView.vue"),
    },
    {
      path: "/user/register",
      name: "register",
      component: () => import("@/views/customer/auth/RegisterView.vue"),
    },
    {
      path: "/user/portfolios-management",
      name: "portfolios-management",
      component: () =>
        import("@/views/customer/portfolio/PortfoliosManagementView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/user/portfolio/:id",
      name: "portfolio",
      component: () => import("@/views/customer/portfolio/PortfolioView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/customer/errors/NotFoundView.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore(pinia);

  if (!userStore.getFirstCheckPassed) {
    const auth = new AuthFirebase();

    await auth.waitAuthorizationData(100);
  }

  if (to.meta?.requiresAuth && !userStore.isLoggedIn) {
    return {
      name: "not-found",
    };
  }

  if (
    (to.name === "registration" || to.name === "login") &&
    userStore.isLoggedIn
  ) {
    return {
      name: "portfolios-management",
    };
  }

  if (to.meta?.isAdminPage && !userStore.isAdmin) {
    return {
      name: "not-found",
    };
  }

  if (to.name === "portfolio") {
    const portfolio = new Portfolios();

    const portfolioId = to.params.id;

    const checkUser = await portfolio.checkUserOwnPortfolio(portfolioId);

    if (!checkUser) {
      return {
        name: "not-found",
      };
    }
  }
});

export default router;
