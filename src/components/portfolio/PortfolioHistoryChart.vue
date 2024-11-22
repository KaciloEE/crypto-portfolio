<template>
  <section class="portfolio-history-chart">
    <v-select
      v-model="selectedCrypto"
      :items="cryptos"
      item-title="name"
      item-value="name"
      dense
      label="Select a crypto"
    />
    <Line
      v-if="cryptos.length && chartData"
      :data="chartData"
      :options="chartOptions"
    />
  </section>
</template>

<script>
import { Line } from "vue-chartjs";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { getCryptoHistory } from "@/services/api";

export default {
  props: ["readyData"],
  components: { Line },
  data() {
    return {
      selectedCrypto: null,
      chart: {
        labels: [],
        datasets: [],
      },
    };
  },
  watch: {
    selectedCrypto: "fetchData",
  },
  computed: {
    cryptos() {
      return this.readyData.map((item) => {
        return item.name;
      });
    },
    chartData() {
      return this.chart;
    },
  },
  methods: {
    async fetchData() {
      if (!this.selectedCrypto) return;

      const data = await getCryptoHistory(this.selectedCrypto.toLowerCase());
      if (!data) {
        return;
      }

      const labels = data.prices.map(([timestamp]) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US");
      });

      const prices = data.prices.map(([timestamp, price]) => ({
        x: new Date(timestamp),
        y: price,
      }));

      this.chart = {
        labels,
        datasets: [
          {
            label: `${this.selectedCrypto} Price`,
            data: prices,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      };
    },
  },
};
</script>
