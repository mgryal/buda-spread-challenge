import { OrderBook } from './types';

export const spreadHelper = {
  calculateSpread: (orderBook: OrderBook) => {
    if (orderBook.asks.length === 0 || orderBook.bids.length === 0) return null;
    const minimumAsk = orderBook.asks.reduce(
      (min, ask) => (ask.price < min ? ask.price : min),
      orderBook.asks[0].price
    );
    const maximumBid = orderBook.bids.reduce(
      (max, bid) => (bid.price > max ? bid.price : max),
      orderBook.bids[0].price
    );

    console.log('Minimum Ask:', minimumAsk);
    console.log('Maximum Bid:', maximumBid);
    console.log('Spread:', minimumAsk - maximumBid);
    const spread = minimumAsk - maximumBid;
    return spread;
  },
};
