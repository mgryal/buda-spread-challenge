// import { OrderBook } from './model';
import axios from '@/common/config/axios';

import { adaptMarket, adaptOrderBook } from './adapters';
import { Market, MarketBudaApi, OrderBook, OrderBookBudaApi } from './types';

export const spreadRepository = {
  getAllMarkets: async (): Promise<Market[]> => {
    const markets = await axios.get<{ markets: MarketBudaApi[] }>('/markets').then((response) => {
      const data = response.data.markets;
      return data.map((market) => adaptMarket(market));
    });
    return markets;
  },
  getAllOrders: async (): Promise<OrderBook[]> => {
    const markets = await spreadRepository.getAllMarkets();
    const orderBooks: OrderBook[] = [];
    const promises = markets.map((market) => axios.get<OrderBookBudaApi>(`/markets/${market.id}/order_book`));
    const responses = await Promise.all(promises);
    responses.forEach((response, index) => {
      const orderBook = adaptOrderBook(markets[index].id, response.data);
      if (orderBook.market === 'BTC-ARS') {
        console.log(response.data);
      }
      orderBooks.push(orderBook);
    });
    return orderBooks;
  },
  getOrderbyMarket: async (marketId: string): Promise<OrderBook> => {
    const orderBook = await axios.get<OrderBookBudaApi>(`/markets/${marketId}/order_book`);
    return adaptOrderBook(marketId, orderBook.data);
  },
};
