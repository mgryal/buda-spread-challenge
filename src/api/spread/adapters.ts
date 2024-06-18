import { Market, MarketBudaApi, OrderBook, OrderBookBudaApi } from '@/api/spread/types';

export const adaptMarket = (market: MarketBudaApi): Market => ({
  id: market.id,
  name: market.name,
  base: market.base_currency,
  quote: market.quote_currency,
  minOrder: [Number(market.minimum_order_amount[0]), market.minimum_order_amount[1]],
  takerFee: market.taker_fee,
  makerFee: market.maker_fee,
  maxOrdersPerMinute: market.max_orders_per_minute,
  makerDiscountPercentage: Number(market.maker_discount_percentage),
  takerDiscountPercentage: Number(market.taker_discount_percentage),
});

export const adaptOrderBook = (marketId: string, orderBook: OrderBookBudaApi): OrderBook => ({
  market: marketId,
  bids: orderBook.order_book.bids.map((order: [string, string]) => ({
    price: Number(order[0]),
    size: Number(order[1]),
  })),
  asks: orderBook.order_book.asks.map((order: [string, string]) => ({
    price: Number(order[0]),
    size: Number(order[1]),
  })),
});
