<template>
  <v-form
    ref="form"
    id="add-coin-form"
    action="#"
    method="post"
    class="add-coin-form"
    @submit.prevent="addCoins"
  >
    <p
      class="add-coin-form-title text-h5 text-center font-weight-medium text-blue-accent-3 mb-4"
    >
      Add a coin
    </p>

    <AutocompleteWithImg
      v-model="form.selectedCoin"
      :items="availableCoins"
      item-title="name"
      item-value="id"
      :rules="selectCoinRules"
    />

    <v-text-field
      v-model="form.coinsAmount"
      type="number"
      label="Number of coins"
      :rules="numberRules"
      variant="solo"
      class="add-coin-form-input-amount-coins mb-2"
      @input="
        negativeNumbersBun('coinsAmount');
        calculationCoinsValue();
      "
    >
    </v-text-field>

    <v-text-field
      v-model="form.money"
      type="number"
      label="Investments, $"
      :rules="numberRules"
      variant="solo"
      class="add-coin-form-input-amount-money mb-2"
      @input="
        negativeNumbersBun('money');
        checkInputMoney = true;
      "
    >
    </v-text-field>

    <v-btn
      :loading="isLoading"
      :disabled="isLoading"
      type="submit"
      block
      color="blue-accent-3"
    >
      Add
    </v-btn>
  </v-form>
</template>

<script>
import AutocompleteWithImg from "@/components/ui/autocomplete/AutocompleteWithImg.vue";
import { CoinsInPortfolios } from "@/services/database.js";
import { getCoinData } from "@/services/coin-gecko.js";
import { usePortfoliosStore } from "@/stores/portfolios";

export default {
  name: "AddCoinsForm",
  emits: ["updatePortfolio"],
  components: {
    AutocompleteWithImg,
  },
  data() {
    return {
      form: {
        selectedCoin: "",
        coinsAmount: 0,
        money: 0,
      },
      currentPrice: null,
      checkInputMoney: false,
      selectCoinRules: [(v) => !!v || "Be sure to select a coin"],
      numberRules: [
        (v) => !!v || "Cannot be equal to 0",
        (v) => !isNaN(v) || "Must be a number",
        (v) => v > 0 || "Can't be negative",
      ],
      isLoading: false,
    };
  },
  methods: {
    negativeNumbersBun(key) {
      this.form[key] = this.form[key] < 0 ? 0 : this.form[key];
    },
    calculationCoinsValue() {
      if ((!this.checkInputMoney || !this.form.money) && this.currentPrice) {
        this.checkInputMoney = false;

        const coinsAmount = this.form.coinsAmount;

        this.form.money = Number((coinsAmount * this.currentPrice).toFixed(5));
      }
    },
    async validateForm() {
      const { valid } = await this.$refs.form.validate();

      return valid;
    },
    async addCoins() {
      const valid = await this.validateForm();

      if (valid) {
        const coinsInPortfolios = new CoinsInPortfolios();

        const portfolioId = this.$route.params.id;

        const coinId = this.form.selectedCoin;
        const coinsAmount = Number(this.form.coinsAmount);
        const money = Number(this.form.money);
        const symbol =
          this.availableCoins.filter((item) => item.id === coinId)[0].symbol ??
          "";

        this.isLoading = true;

        await coinsInPortfolios.addHistoryCoinInPortfolio(
          portfolioId,
          coinId,
          coinsAmount,
          money,
          symbol
        );

        this.isLoading = false;

        this.$emit("updatePortfolio");

        this.currentPrice = null;

        this.$refs.form.reset();
      }
    },
  },
  computed: {
    availableCoins() {
      const store = usePortfoliosStore();
      return store.getCryptoList;
    },
  },
  watch: {
    async "form.selectedCoin"(newValue) {
      if (newValue) {
        this.currentPrice = null;

        const coinData = await getCoinData(newValue);

        if (!coinData) {
          return;
        }

        if (coinData.length === 0) {
          return;
        }

        this.currentPrice = coinData[0].current_price;
      }
    },
  },
  async mounted() {
    const store = usePortfoliosStore();
    store.loadCryptoList();
  },
};
</script>
