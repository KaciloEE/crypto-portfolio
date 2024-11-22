import { mount } from "@vue/test-utils";
import PortfolioView from "@/views/customer/portfolio/PortfolioView.vue";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { createVuetify } from "vuetify";

const vuetify = createVuetify();

vi.mock("@/components/portfolio/PortfolioLineChart.vue", () => ({
  default: {
    name: "PortfolioLineChart",
    render: () => null,
  },
}));
vi.mock("@/components/portfolio/PortfolioHistoryChart.vue", () => ({
  default: {
    name: "PortfolioHistoryChart",
    render: () => null,
  },
}));
vi.mock("@/components/portfolio/PortfolioCoins.vue", () => ({
  default: {
    name: "PortfolioCoins",
    render: () => null,
  },
}));
vi.mock("@/components/portfolio/AddCoinForm.vue", () => ({
  default: {
    name: "AddCoinForm",
    render: () => null,
  },
}));

vi.mock("@/services/database.js", () => ({
  CoinsInPortfolios: vi.fn(() => ({
    getSumHistoryCoinsInPortfolio: vi.fn().mockResolvedValue({
      bitcoin: { totalCoins: 2, totalMoney: 5000 },
    }),
  })),
}));
vi.mock("@/services/coin-gecko.js", () => ({
  getCoinsList: vi
    .fn()
    .mockResolvedValue([{ id: "bitcoin", current_price: 25000 }]),
}));

describe("PortfolioView.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PortfolioView, {
      global: {
        mocks: {
          $route: {
            params: { id: "test-portfolio-id" },
          },
        },
        stubs: { transition: false },
      },
    });
  });

  it("renders currency selector and components", () => {
    expect(wrapper.find(".currency-selector").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "PortfolioLineChart" }).exists()).toBe(
      true
    );
    expect(
      wrapper.findComponent({ name: "PortfolioHistoryChart" }).exists()
    ).toBe(true);
    expect(wrapper.findComponent({ name: "PortfolioCoins" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "AddCoinForm" }).exists()).toBe(true);
  });

  it("calls loadingData and updates readyData", async () => {
    await wrapper.vm.loadingData();

    expect(wrapper.vm.readyData).toEqual([
      {
        id: "bitcoin",
        current_price: 25000,
        coinsAmountInPortfolio: 2,
        invested: 5000,
        avgBuyPrice: 2500,
        realCostCoinInPortfolio: 50000,
        profitOrLoss: 45000,
      },
    ]);
  });

  it("updates readyData when currency is changed", async () => {
    const select = wrapper.find("select#currency");
    await select.setValue("EUR");
    await wrapper.vm.updatePortfolio();

    expect(wrapper.vm.selectedCurrency).toBe("EUR");
    expect(wrapper.vm.readyData).toEqual([
      {
        id: "bitcoin",
        current_price: 25000,
        coinsAmountInPortfolio: 2,
        invested: 5000,
        avgBuyPrice: 2500,
        realCostCoinInPortfolio: 50000,
        profitOrLoss: 45000,
      },
    ]);
  });

  it("handles currency change event correctly", async () => {
    const spy = vi.spyOn(wrapper.vm, "updatePortfolio");
    const select = wrapper.find("select#currency");
    await select.setValue("EUR");
    expect(spy).toHaveBeenCalled();
  });
});
