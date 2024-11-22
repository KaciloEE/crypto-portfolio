import { beforeAll, afterAll, vi } from 'vitest';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { createTestingPinia } from '@pinia/testing';

beforeAll(() => {
  vi.mock('@/services/coin-gecko.js', () => ({
    getCoinData: vi.fn(() => Promise.resolve([{ current_price: 100 }])),
  }));

  vi.mock('@/services/database.js', () => ({
    CoinsInPortfolios: vi.fn(() => ({
      addHistoryCoinInPortfolio: vi.fn(() => Promise.resolve()),
    })),
  }));

  config.global.plugins = [
    createVuetify(),
    createTestingPinia(),
  ];

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});
