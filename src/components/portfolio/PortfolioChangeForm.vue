<template>
  <v-form
    ref="form"
    action="#"
    method="post"
    class="portfolio-form d-flex justify-center align-start"
  >
    <v-text-field
      v-model="form.name"
      :rules="!isDisabled ? nameRules : undefined"
      variant="solo"
      v-bind="{ disabled: isDisabled }"
      class="portfolio-form-input"
      maxlenght="12"
    >
      <template #prepend>
        <img
          src="@/assets/images/work.png"
          alt="work"
          class="portfolio-form-prepend-img"
        />
      </template>
    </v-text-field>

    <template v-if="isDisabled">
      <v-btn
        class="ml-2 mt-1"
        color="orange-darken-2"
        icon="mdi-wrench"
        @click="changeIsDisabled"
        :loading="isLoading"
        :disabled="isLoading"
      ></v-btn>

      <DialogYesNo
        class-activator="ml-1 mt-1"
        color-activator="red"
        icon-activator="mdi-minus-circle"
        title-dialog="Delete"
        color-dialog="error"
        :is-loading="isLoading"
      >
        <template #text> Are you sure you want to delete? </template>

        <template #yes-no-buttons="{ isActive }">
          <v-btn text="Yes" @click="deletePortfolio(isActive)"></v-btn>
          <v-btn text="No" @click="isActive.value = false"></v-btn>
        </template>
      </DialogYesNo>
    </template>

    <template v-if="!isDisabled">
      <v-btn
        class="ml-2 mt-1"
        color="primary"
        icon="mdi-checkbox-marked-circle"
        @click="changePortfolioName"
        :loading="isLoading"
        :disabled="isLoading"
      ></v-btn>

      <v-btn
        class="ml-1 mt-1"
        color="red"
        icon="mdi-cancel"
        @click="cancelChangePortfolioName"
        :loading="isLoading"
        :disabled="isLoading"
      ></v-btn>
    </template>
  </v-form>
</template>

<script>
import { portfolioForm } from "@/mixins/form.js";
import DialogYesNo from "@/components/ui/dialog/DialogYesNo.vue";
import { Portfolios } from "@/services/database.js";
import { delay } from "@/utils/utils.js";

export default {
  name: "PortfolioChangeForm",
  mixins: [portfolioForm],
  components: {
    DialogYesNo,
  },
  props: {
    portfolio: Object,
  },
  data() {
    return {
      isDisabled: true,
    };
  },
  methods: {
    changeIsDisabled() {
      this.isDisabled = !this.isDisabled;
    },
    async changePortfolioName() {
      const valid = await this.validateForm();

      if (valid) {
        const dbPortfolio = new Portfolios();

        const portfolioId = this.portfolio.id;
        const name = this.form.name;

        this.isLoading = true;

        await dbPortfolio.updatePortfolioName(portfolioId, name);

        this.isLoading = false;

        this.changeIsDisabled();
      }
    },
    cancelChangePortfolioName() {
      this.form.name = this.portfolio.name;

      this.changeIsDisabled();
    },
    async deletePortfolio(isActive) {
      isActive.value = false;

      const dbPortfolio = new Portfolios();

      this.isLoading = true;

      await dbPortfolio.deletePortfolio(this.portfolio.id);

      this.isLoading = false;
    },
  },
  mounted() {
    this.form.name = this.portfolio.name;
  },
};
</script>
