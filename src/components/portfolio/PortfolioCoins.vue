<template>
  <section class="portfolio-coins">
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <img
          src="@/assets/images/work.png"
          alt="logo"
          class="portfolio-coins-title-img"
        />
        Assets
      </v-card-title>
    </v-card>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="getPaginationData"
      :hide-default-footer="true"
      class="portfolio-coins-table"
    >
      <template #item="{ item }">
        <tr>
          <td class="portfolio-coins-table-header-name">
            <img :src="item.image" alt="coin" />
            <div>
              <p>
                {{ item.name }}
              </p>
              <p>
                {{ item.symbol }}
              </p>
            </div>
          </td>
          <td>
            <span v-divide-number="item.current_price">
              {{ item.current_price }}
            </span>
            {{ currency }}
          </td>
          <td v-price-movement="item.price_change_percentage_24h">
            <span v-divide-number="item.price_change_percentage_24h"> </span>
            %
          </td>
          <td>
            <p>
              {{ currency }}
              <span v-divide-number="item.realCostCoinInPortfolio"> </span>
            </p>
            <p>
              <span v-divide-number="item.coinsAmountInPortfolio"> </span>
              {{ item.symbol }}
            </p>
          </td>
          <td>
            <span v-divide-number="item.avgBuyPrice"> </span>
            {{ currency }}
          </td>
          <td v-price-movement="item.profitOrLoss">
            <span v-divide-number="item.profitOrLoss"> </span>
            {{ currency }}
          </td>
          <td>
            <span v-divide-number="item.invested"> </span>
            {{ currency }}
          </td>
          <td>
            <v-btn
              color="error"
              @click="showModalDeleteCoins(item.id, item.name)"
            >
              Delete
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <ModalDeleteCoins
      v-model="isShowModalDeleteCoins"
      :coin-id="coinId"
      :coin-name="coinName"
      @reset-coin-id="resetCoinId"
      @update-portfolio="updatePortfolio"
    />

    <div v-if="getAmountPages > 1" class="portfolio-coins-pagination">
      <v-btn @click="prevPage" :disabled="checkPrevPage"> < </v-btn>
      <v-btn @click="nextPage" :disabled="checkNextPage"> > </v-btn>
      <p>{{ currentPage }} of {{ getAmountPages }} pages</p>
    </div>
  </section>
</template>

<script>
import ModalDeleteCoins from "@/components/portfolio/ModalDeleteCoins.vue";
import { pagination } from "@/mixins/pagination.js";
import { divideNumber, priceMovement } from "@/directives/directives.js";

export default {
  name: "PortfolioCoins",
  mixins: [pagination],
  emits: ["updatePortfolio"],
  components: { ModalDeleteCoins },
  props: {
    readyData: Array,
    currency: String,
  },
  directives: {
    priceMovement,

    divideNumber,
  },
  data() {
    return {
      headers: [
        {
          key: "name",
          title: "Name",
          align: "start",
          sortable: false,
        },
        {
          key: "price",
          title: "Price",
          sortable: false,
        },
        {
          key: "24HChange",
          title: "24h%",
          sortable: false,
        },
        {
          key: "holdings",
          title: "Holdings",
          sortable: false,
        },
        {
          key: "avgBuy",
          title: "Avg. Buy Price",
          sortable: false,
        },
        {
          key: "profitOrLoss",
          title: "Profit/Loss",
          sortable: false,
        },
        {
          key: "invested",
          title: "Invested",
          sortable: false,
        },
        {
          key: "actions",
          title: "Actions",
          sortable: false,
        },
      ],

      isShowModalDeleteCoins: false,
      coinId: null,
      coinName: "...",
    };
  },
  computed: {
    getData() {
      return this.readyData;
    },
  },
  methods: {
    showModalDeleteCoins(coinId, coinName) {
      this.isShowModalDeleteCoins = true;

      this.coinId = coinId;
      this.coinName = coinName;
    },
    resetCoinId() {
      this.coinId = null;
    },
    updatePortfolio() {
      this.$emit("updatePortfolio");
    },
  },
};
</script>
