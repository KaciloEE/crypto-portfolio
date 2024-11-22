import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      firstCheckPassed: false,
      user: {
        isLoggedIn: false,
        accessToken: "",
        id: "",
        email: "",
        isAdmin: false,
      },
    };
  },
  getters: {
    getFirstCheckPassed: (state) => state.firstCheckPassed,
    isLoggedIn: (state) => state.user.isLoggedIn,
    isAdmin: (state) => state.user.isAdmin,
    getUserEmail: (state) => state.user.email,
    getUserId: (state) => state.user.id,
    getUserRoleText: (state) => {
      return state.user.isAdmin ? "Admin" : "User";
    },
  },
  actions: {
    addUser(user) {
      this.user.isLoggedIn = true;
      this.user.accessToken = user.accessToken;
      this.user.id = user.uid;
      this.user.email = user.email;
    },
    updateIsAdmin(access) {
      this.user.isAdmin = access;
    },
    reset() {
      for (let key in this.user) {
        this.user[key] = typeof this.user[key] === "boolean" ? false : "";
      }
    },
    updateFirstCheckPassed(value) {
      this.firstCheckPassed = value;
    },
  },
});
