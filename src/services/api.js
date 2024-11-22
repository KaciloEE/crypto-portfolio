import axios from "axios";

// const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const PROXY_URL = "https://thingproxy.freeboard.io/fetch/";
const API_BASE_URL = "https://api.coingecko.com/api/v3";

export const getCryptoHistory = async (
  cryptoId,
  currency = "usd",
  days = 7
) => {
  try {
    const { data } = await axios.get(
      PROXY_URL + `${API_BASE_URL}/coins/${cryptoId}/market_chart`,
      {
        params: { vs_currency: currency, days },
      }
    );
    return data;
  } catch (error) {
    console.error("Ошибка при получении исторических данных:", error);
    return null;
  }
};

export async function getCryptoList() {
  try {
    // coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true
    const response = await axios.get(
      PROXY_URL + "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка криптовалют:", error);
    return [];
  }
}
