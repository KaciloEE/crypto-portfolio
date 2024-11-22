import axios from "axios";

import env from "../env.js";

const PROXY_URL = "https://thingproxy.freeboard.io/fetch/";
const API_BASE_URL = "https://api.coingecko.com/api/v3/coins/markets";
const urlCoinsMarkets = PROXY_URL + API_BASE_URL;

const getOptions = (method = "GET", url, params = {}) => {
  return {
    method,
    url,
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": env.X_CG_DEMO_API_KEY,
    },
    params: {
      ...params,
    },
  };
};

export const getCoinsList = async (coinsId, currency = "usd") => {
  const url = urlCoinsMarkets;

  const params = {
    vs_currency: currency,
    ids: coinsId,
  };

  const options = getOptions(undefined, url, params);

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(`Error, getCoinsList: ${error}`);
    return null;
  }
};

export const getCoinData = async (coinId) => {
  const url = urlCoinsMarkets;

  const params = {
    vs_currency: "usd",
    ids: coinId,
  };

  const options = getOptions(undefined, url, params);

  try {
    const response = await axios.request(options);

    return response.data;
  } catch (error) {
    console.error(`Error, getCoinsList: ${error}`);

    return null;
  }
};
