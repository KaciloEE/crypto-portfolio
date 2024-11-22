import { mount } from "@vue/test-utils";
import AddCoinsForm from "@/components/portfolio/AddCoinForm.vue";
import { describe, it, expect, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createTestingPinia } from "@pinia/testing";
import AutocompleteWithImg from "@/components/ui/autocomplete/AutocompleteWithImg.vue";

const vuetify = createVuetify();

describe("AddCoinsForm.vue", () => {
  it("renders the form correctly", () => {
    const wrapper = mount(AddCoinsForm, {
      global: {
        plugins: [vuetify, createTestingPinia()],
        components: { AutocompleteWithImg },
      },
    });

    expect(wrapper.find(".add-coin-form-title").exists()).toBe(true);
    expect(wrapper.findComponent(AutocompleteWithImg).exists()).toBe(true);
    expect(wrapper.find('v-text-field[label="Number of coins"]').exists()).toBe(
      true
    );
    expect(wrapper.find('v-text-field[label="Investments, $"]').exists()).toBe(
      true
    );
  });

  it("disables the submit button when loading", async () => {
    const wrapper = mount(AddCoinsForm, {
      global: {
        plugins: [vuetify, createTestingPinia()],
        components: { AutocompleteWithImg },
      },
    });

    await wrapper.setData({ isLoading: true });
    const button = wrapper.find('v-btn[type="submit"]');

    expect(button.attributes("disabled")).toBeTruthy();
  });

  it("updates money based on coins amount and current price", async () => {
    const wrapper = mount(AddCoinsForm, {
      global: {
        plugins: [vuetify, createTestingPinia()],
        components: { AutocompleteWithImg },
      },
    });
    await wrapper.setData({ currentPrice: 200 });
    await wrapper.setData({ form: { coinsAmount: 3 } });

    await wrapper.vm.calculationCoinsValue();

    expect(wrapper.vm.form.money).toBe(600);
  });
});
