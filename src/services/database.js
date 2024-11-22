import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  getDoc,
} from "firebase/firestore";

import { db, pinia } from "@/main.js";
import { usePortfoliosStore } from "@/stores/portfolios.js";
import { useUserStore } from "@/stores/auth.js";
import { delay } from "@/utils/utils.js";

class BasicFirestore {
  constructor() {
    this._db = db;
  }

  get db() {
    return this._db;
  }

  async batchDeletion(snapshot) {
    const docs = snapshot.docs;

    let batch = writeBatch(this.db);

    let count = 0;

    for (let i = 0; i < docs.length; i++) {
      batch.delete(docs[i].ref);

      count++;

      if (i === docs.length - 1) {
        await batch.commit();

        break;
      }

      if (count === 10) {
        await batch.commit();

        batch = writeBatch(this.db);

        count = 0;
      }
    }
  }
}

export default class User extends BasicFirestore {
  constructor() {
    super();
  }

  async addUserRole(user, isAdmin = false) {
    try {
      await setDoc(doc(this.db, "users", user.uid), {
        email: user.email,
        is_admin: isAdmin,
      });
    } catch (error) {
      console.log(`Error, addUserRole: ${error}`);
    }
  }

  listenerUserRole(userId, userStore) {
    try {
      const userRef = doc(this.db, "users", userId);

      return onSnapshot(userRef, (doc) => {
        const data = doc.data();

        if (data) {
          userStore.updateIsAdmin(data.is_admin);
        }
      });
    } catch (error) {
      console.log(`Error, listenerUserRole: ${error}`);

      return null;
    }
  }

  listenerOff(listenerUser) {
    return listenerUser ? listenerUser() : null;
  }
}

export class CoinsInPortfolios extends BasicFirestore {
  constructor() {
    super();
  }

  async addHistoryCoinInPortfolio(
    portfolioId,
    coinId,
    coinsAmount,
    money,
    symbol
  ) {
    try {
      await addDoc(collection(this.db, "coins_in_portfolios"), {
        portfolio_id: portfolioId,
        coin_id: coinId,
        coins_amount: coinsAmount,
        money: money,
        symbol: symbol,
        date: new Date(),
      });
    } catch (error) {
      console.log(`Error, addHistoryCoinInPortfolio: ${error}`);
    }

    await delay(2000);
  }

  async getHistoryCoinInPortfolio(portfolioId, coinId) {
    try {
      const coinInPortfolioRef = query(
        collection(this.db, "coins_in_portfolios"),
        where("portfolio_id", "==", portfolioId),
        where("coin_id", "==", coinId)
      );
      const coinInPortfolioSnapshot = await getDocs(coinInPortfolioRef);

      if (!coinInPortfolioSnapshot.empty) {
        const coinInPortfolio = [];

        coinInPortfolioSnapshot.forEach((doc) => {
          const data = doc.data();

          coinInPortfolio.push({
            id: doc.id,
            coinsAmount: data.coins_amount,
            money: data.money,
            date: data.date.toDate().toLocaleString(),
          });
        });

        return coinInPortfolio;
      }

      return null;
    } catch (error) {
      console.log(`Error, getHistoryCoinInPortfolio: ${error}`);

      return null;
    }
  }

  async getSumHistoryCoinsInPortfolio(portfolioId) {
    try {
      const coinsInPortfolioRef = query(
        collection(this.db, "coins_in_portfolios"),
        where("portfolio_id", "==", portfolioId)
      );

      const coinsInPortfolioSnapshot = await getDocs(coinsInPortfolioRef);

      if (!coinsInPortfolioSnapshot.empty) {
        const coinsInPortfolio = {};

        coinsInPortfolioSnapshot.forEach((doc) => {
          const data = doc.data();

          const coinId = data.coin_id;

          if (!coinsInPortfolio.hasOwnProperty(coinId)) {
            coinsInPortfolio[coinId] = {
              totalCoins: 0,
              totalMoney: 0,
              symbol: "",
            };
          }

          coinsInPortfolio[coinId].totalCoins += data.coins_amount;
          coinsInPortfolio[coinId].totalMoney += data.money;
          coinsInPortfolio[coinId].symbol += data.symbol;
        });

        return coinsInPortfolio;
      } else {
        return null;
      }
    } catch (error) {
      console.log(`Error, getSumHistoryCoinsInPortfolio: ${error}`);

      return null;
    }
  }

  async deleteHistoryCoinInPortfolio(historyCoinId) {
    try {
      await deleteDoc(doc(this.db, "coins_in_portfolios", historyCoinId));
    } catch (error) {
      console.log(`Error, deleteHistoryCoinInPortfolio: ${error}`);
    }
  }

  async deleteAllHistoryCoinInPortfolio(portfolioId, coinId) {
    try {
      const allHistoryCoinInPortfolioRef = query(
        collection(this.db, "coins_in_portfolios"),
        where("portfolio_id", "==", portfolioId),
        where("coin_id", "==", coinId)
      );

      const allHistoryCoinInPortfolioSnapshot = await getDocs(
        allHistoryCoinInPortfolioRef
      );

      if (!allHistoryCoinInPortfolioSnapshot.empty) {
        await super.batchDeletion(allHistoryCoinInPortfolioSnapshot);
      }
    } catch (error) {
      console.log(`Error, deleteAllHistoryCoinInPortfolio: ${error}`);
    }
  }

  async deleteAllHistoryCoinsInPortfolio(portfolioId) {
    try {
      const allHistoryCoinsInPortfolioRef = query(
        collection(this.db, "coins_in_portfolios"),
        where("portfolio_id", "==", portfolioId)
      );

      const allHistoryCoinsInPortfolioSnapshot = await getDocs(
        allHistoryCoinsInPortfolioRef
      );

      if (!allHistoryCoinsInPortfolioSnapshot.empty) {
        await super.batchDeletion(allHistoryCoinsInPortfolioSnapshot);
      }
    } catch (error) {
      console.log(`Error, deleteAllHistoryCoinsInPortfolio: ${error}`);
    }
  }
}

export class Portfolios extends BasicFirestore {
  #portfoliosStore;
  #userStore;
  #coinsInPortfolios;

  constructor() {
    super();
    this.#portfoliosStore = usePortfoliosStore(pinia);
    this.#userStore = useUserStore(pinia);
    this.#coinsInPortfolios = new CoinsInPortfolios();
  }

  listenerUserPortfolios(userId) {
    try {
      const portfoliosRef = query(
        collection(this.db, "portfolios"),
        where("user_id", "==", userId)
      );

      return onSnapshot(portfoliosRef, (querySnapshot) => {
        const portfolios = [];

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const name = doc.data().name;

          portfolios.push({
            id,
            name,
          });
        });

        this.#portfoliosStore.updateData(portfolios);
      });
    } catch (error) {
      console.log(`Error, listenerUserPortfolios: ${error}`);

      return null;
    }
  }

  async checkUserOwnPortfolio(portfolioId) {
    try {
      const portfolioRef = doc(this.db, "portfolios", portfolioId);

      const portfolioSnapshot = await getDoc(portfolioRef);

      if (portfolioSnapshot.exists()) {
        const userId = this.#userStore.getUserId;
        const ownerId = portfolioSnapshot.data().user_id;

        return userId === ownerId;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Error, checkUserOwnPortfolio: ${error}`);

      return false;
    }
  }

  async addPortfolio(name) {
    const userId = this.#userStore.getUserId;

    try {
      await addDoc(collection(this.db, "portfolios"), {
        user_id: userId,
        name,
      });
    } catch (error) {
      console.log(`Error, addPortfolio: ${error}`);
    }
  }

  async updatePortfolioName(portfolioId, name) {
    try {
      await updateDoc(doc(this.db, "portfolios", portfolioId), {
        name: name,
      });
    } catch (error) {
      console.log(`Error, updatePortfolioName: ${error}`);
    }
  }

  async deletePortfolio(portfolioId) {
    try {
      await deleteDoc(doc(this.db, "portfolios", portfolioId));

      await this.#coinsInPortfolios.deleteAllHistoryCoinsInPortfolio(
        portfolioId
      );
    } catch (error) {
      console.log(`Error, deletePortfolio: ${error}`);
    }
  }

  listenerOff(listenerPortfolios) {
    return listenerPortfolios ? listenerPortfolios() : null;
  }
}
