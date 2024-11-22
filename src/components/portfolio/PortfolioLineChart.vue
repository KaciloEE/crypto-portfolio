<template>
  <section class="portfolio-line-chart">
    <Bar :data="chartData" :options="chartOptions" />
  </section>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

export default {
  name: "PortfolioLineChart",
  components: {
    Bar,
  },
  props: {
    readyData: Array,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    getLabels() {
      return this.readyData.map((item) => {
        return item?.symbol?.toUpperCase();
      });
    },
    getRealCostCoinsInPortfolioData() {
      return this.readyData.map((item) => {
        return item.realCostCoinInPortfolio;
      });
    },
    getInvestedData() {
      return this.readyData.map((item) => {
        return item.invested;
      });
    },
    chartData() {
      return {
        labels: this.getLabels,
        datasets: [
          {
            label: "Real cost, $",
            backgroundColor: "#2cf83f",
            data: this.getRealCostCoinsInPortfolioData,
          },
          {
            label: "Invested, $",
            backgroundColor: "#2979FF",
            data: this.getInvestedData,
          },
        ],
      };
    },
  },
};
</script>
