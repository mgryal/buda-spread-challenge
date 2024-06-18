export interface OrderBook {
  market: string;
  bids: Order[];
  asks: Order[];
}

export interface Order {
  price: number;
  size: number;
}

export interface Market {
  id: string;
  name: string;
  base: string;
  quote: string;
  minOrder: [number, string];
  takerFee: number;
  makerFee: number;
  maxOrdersPerMinute: number;
  makerDiscountPercentage: number;
  takerDiscountPercentage: number;
}

export interface MarketBudaApi {
  id: string;
  name: string;
  base_currency: string;
  quote_currency: string;
  minimum_order_amount: [string, string];
  taker_fee: number;
  maker_fee: number;
  max_orders_per_minute: number;
  maker_discount_percentage: string;
  taker_discount_percentage: string;
}

export interface OrderBookBudaApi {
  order_book: {
    asks: [string, string][];
    bids: [string, string][];
  };
}

export interface Spread {
  marketId: string;
  isGreaterThanAlert?: boolean;
  spread: number | null;
}

export interface SpreadAlert {
  spreadAlertValue: number;
}
