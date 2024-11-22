<template>
  <section class="portfolios-management-view">
    <PortfoliosManagementForm />
  </section>
</template>

<script>
import PortfoliosManagementForm from "@/components/portfolio/PortfoliosManagementForm.vue";

export default {
  name: "PortfoliosManagementView",
  components: {
    PortfoliosManagementForm,
  },
};
</script>
