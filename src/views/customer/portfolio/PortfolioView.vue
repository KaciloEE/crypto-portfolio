<template>
  <section class="portfolio-view px-1 py-2">
    <div class="currency-selector">
      <label for="currency">Выберите валюту:</label>
      <select
        id="currency"
        v-model="selectedCurrency"
        @change="updatePortfolio"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
    </div>

    <PortfolioLineChart :ready-data="readyData" />

    <AddCoinForm @update-portfolio="updatePortfolio" />
    <PortfolioCoins
      :ready-data="readyData"
      @update-portfolio="updatePortfolio"
      :currency="selectedCurrency"
    />

    <div v-if="timeLeft > 0" class="update-timer">
      <p>Следующее обновление через: {{ timeLeft }} секунд</p>
    </div>

    <PortfolioHistoryChart :ready-data="readyData" />
  </section>
</template>

<script>
import PortfolioLineChart from "@/components/portfolio/PortfolioLineChart.vue";
import PortfolioHistoryChart from "@/components/portfolio/PortfolioHistoryChart.vue";
import PortfolioCoins from "@/components/portfolio/PortfolioCoins.vue";
import AddCoinForm from "@/components/portfolio/AddCoinForm.vue";
import { CoinsInPortfolios } from "@/services/database.js";
import { getCoinsList } from "@/services/coin-gecko.js";

export default {
  name: "PortfolioView",
  components: {
    AddCoinForm,
    PortfolioCoins,
    PortfolioLineChart,
    PortfolioHistoryChart,
  },
  data() {
    return {
      readyData: [],
      updateDataTimerId: null,
      timeLeft: 0,
      updateInterval: 60,
      selectedCurrency: "USD",
    };
  },
  computed: {
    currentPortfolioId() {
      return this.$route.params.id;
    },
  },
  methods: {
    getKeysObject(newObject) {
      return Object.keys(newObject).join(",");
    },
    roundingNumber(number, fractionDigits) {
      return Number(number.toFixed(fractionDigits));
    },
    calculateAvgBuyPrice(coinsAmount, money) {
      return Number((money / coinsAmount).toFixed(5));
    },
    calculateRealCostCoinInPortfolio(coinPrice, coinsAmount) {
      return Number((coinPrice * coinsAmount).toFixed(5));
    },
    calculateProfitOrLoss(coinPrice, coinsAmount, money) {
      const profitOrLoss = coinPrice * coinsAmount - money;
      return Number(profitOrLoss.toFixed(5));
    },
    getReadyData(realCoinsData, coinsWithPortfolio) {
      for (let i = 0; i < realCoinsData.length; i++) {
        const coinId = realCoinsData[i].id;
        const coinPrice = realCoinsData[i].current_price;

        const coinsAmount = coinsWithPortfolio[coinId].totalCoins;
        const money = coinsWithPortfolio[coinId].totalMoney;

        realCoinsData[i].coinsAmountInPortfolio = this.roundingNumber(
          coinsAmount,
          10
        );
        realCoinsData[i].invested = this.roundingNumber(money, 5);
        realCoinsData[i].avgBuyPrice = this.calculateAvgBuyPrice(
          coinsAmount,
          money
        );
        realCoinsData[i].realCostCoinInPortfolio =
          this.calculateRealCostCoinInPortfolio(coinPrice, coinsAmount);
        realCoinsData[i].profitOrLoss = this.calculateProfitOrLoss(
          coinPrice,
          coinsAmount,
          money
        );
      }

      return realCoinsData;
    },
    async loadingData() {
      const coinsInPortfolios = new CoinsInPortfolios();
      const portfolioId = this.currentPortfolioId;

      const coinsWithPortfolio =
        await coinsInPortfolios.getSumHistoryCoinsInPortfolio(portfolioId);

      if (!coinsWithPortfolio) {
        this.readyData = [];
        return;
      }

      const coinsId = this.getKeysObject(coinsWithPortfolio);

      const realCoinsData = await getCoinsList(coinsId, this.selectedCurrency);

      if (!realCoinsData) {
        return;
      }

      this.readyData = this.getReadyData(realCoinsData, coinsWithPortfolio);
    },

    async updatePortfolio() {
      clearInterval(this.updateDataTimerId);

      this.timeLeft = this.updateInterval;

      this.updateDataTimerId = setInterval(() => {
        this.loadingData();

        this.timeLeft = this.updateInterval;
      }, this.updateInterval * 1000);

      await this.loadingData();

      this.startCountdown();
    },

    startCountdown() {
      clearInterval(this.timeLeftTimerId);
      this.timeLeftTimerId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        }
      }, 1000);
    },
  },
  watch: {
    async currentPortfolioId(newValue, oldValue) {
      await this.updatePortfolio();
    },
  },
  async mounted() {
    await this.updatePortfolio();
  },

  unmounted() {
    if (this.updateDataTimerId) {
      clearInterval(this.updateDataTimerId);
    }
    if (this.timeLeftTimerId) {
      clearInterval(this.timeLeftTimerId);
    }
  },
};
</script>
