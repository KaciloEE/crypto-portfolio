import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { useUserStore } from "@/stores/auth.js";
import { pinia } from "@/main.js";
import { auth } from "@/main.js";
import User, { Portfolios } from "@/services/database.js";
import { delay } from "@/utils/utils.js";

export default class AuthFirebase {
  #auth;
  #userStore;
  #dbUser;
  #dbPortfolios;

  constructor() {
    this.#auth = auth;
    this.#userStore = useUserStore(pinia);
    this.#dbUser = new User();
    this.#dbPortfolios = new Portfolios();
  }

  register(email, password, router, outputError) {
    createUserWithEmailAndPassword(this.#auth, email, password)
      .then((userData) => {
        this.#dbUser.addUserRole(userData.user);

        router.push({
          name: "portfolios-management",
        });
      })
      .catch((error) => {
        outputError(error);
      });
  }

  login(email, password, router, outputError) {
    signInWithEmailAndPassword(this.#auth, email, password)
      .then((userData) => {
        router.push({
          name: "portfolios-management",
        });
      })
      .catch((error) => {
        outputError(error);
      });
  }

  signOut(router) {
    signOut(this.#auth)
      .then((result) => {
        router.push({
          name: "login",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`${errorCode}: ${errorMessage}`);
      });
  }

  async watcherAuthorizationAndRole() {
    let listenerUser = null;
    let listenerPortfolios = null;

    onAuthStateChanged(this.#auth, (user) => {
      this.#dbUser.listenerOff(listenerUser);
      this.#dbPortfolios.listenerOff(listenerPortfolios);

      if (user) {
        this.#userStore.addUser(user);

        listenerUser = this.#dbUser.listenerUserRole(user.uid, this.#userStore);

        listenerPortfolios = this.#dbPortfolios.listenerUserPortfolios(
          user.uid
        );
      } else {
        this.#userStore.reset();

        this.#dbUser.listenerOff(listenerUser);
        this.#dbPortfolios.listenerOff(listenerPortfolios);

        listenerUser = null;
        listenerPortfolios = null;
      }

      if (!this.#userStore.getFirstCheckPassed) {
        this.#userStore.updateFirstCheckPassed(true);
      }
    });
  }

  async waitAuthorizationData(delayMilliseconds) {
    if (!this.#userStore.getFirstCheckPassed && delayMilliseconds < 3000) {
      await delay(delayMilliseconds);

      delayMilliseconds += 100;

      await this.waitAuthorizationData(delayMilliseconds);
    }
  }
}
