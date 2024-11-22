import { defineStore } from "pinia";
import { getCryptoList } from "../services/api";

export const usePortfoliosStore = defineStore("portfolios", {
  state: () => {
    return {
      portfolios: [],
      cryptoList: [],
    };
  },
  getters: {
    getData: (state) => state.portfolios,
    getCryptoList: (state) => state.cryptoList ?? [],
  },
  actions: {
    updateData(portfolios) {
      this.portfolios = portfolios.slice(0);
    },
    includesName(name) {
      name = name.trim();

      return this.portfolios.find((portfolio) => {
        return portfolio.name === name;
      });
    },
    includesId(id) {
      return this.portfolios.find((portfolio) => {
        return portfolio.id === id;
      });
    },
    async loadCryptoList() {
      try {
        this.cryptoList = await getCryptoList();
      } catch (error) {
        console.error("Error loading crypto list:", error);
      }
    },
  },
});
