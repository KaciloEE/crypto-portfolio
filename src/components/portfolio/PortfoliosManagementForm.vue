<template>
  <section class="portfolios-form-wrapper ma-2">
    <p
      class="portfolios-form-title text-h6 text-center font-weight-bold text-blue-accent-3 mb-4"
    >
      Portfolios
    </p>

    <div class="portfolios-form-data d-flex flex-column align-center">
      <template v-if="portfolios.length > 0">
        <template v-for="portfolio in portfolios" :key="portfolio.id">
          <PortfolioChangeForm :portfolio="portfolio" />
        </template>
      </template>
    </div>

    <div v-if="portfolios.length < 5" class="portfolios-form-add">
      <v-divider v-if="portfolios.length > 0"> Or </v-divider>

      <v-form
        ref="form"
        action="#"
        method="post"
        class="portfolios-form"
        @submit.prevent="addPortfolio"
      >
        <v-text-field
          v-model="form.name"
          :rules="nameRules"
          label="Name"
          variant="outlined"
          class="mt-4 mb-1"
          required
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
    </div>
    <div v-else class="portfolios-form-add">
      <v-btn block color="blue-accent-3"> Maximum 5 portfolios </v-btn>
    </div>
  </section>
</template>

<script>
import PortfolioChangeForm from "@/components/portfolio/PortfolioChangeForm.vue";
import { portfolioForm } from "@/mixins/form.js";
import { Portfolios } from "@/services/database.js";

export default {
  name: "PortfoliosManagementForm",
  mixins: [portfolioForm],
  components: {
    PortfolioChangeForm,
  },
  computed: {
    portfolios() {
      return this.portfoliosStore.getData;
    },
  },
  methods: {
    async addPortfolio() {
      const valid = await this.validateForm();

      if (valid) {
        const name = this.form.name;

        this.$refs.form.reset();

        const dbPortfolio = new Portfolios();

        this.isLoading = true;

        await dbPortfolio.addPortfolio(name);

        this.isLoading = false;
      }
    },
  },
};
</script>
