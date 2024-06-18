import { spreadHelper } from '../helper';
import { OrderBook, Spread } from '../types';

describe('spread helper', () => {
  const mockOrderBook: OrderBook[] = [
    {
      market: 'BTC-CLP',
      bids: [
        { price: 100, size: 1 },
        { price: 200, size: 2 },
      ],
      asks: [
        { price: 300, size: 3 },
        { price: 400, size: 4 },
      ],
    },
    {
      market: 'ETH-CLP',
      bids: [
        { price: 200, size: 1 },
        { price: 100, size: 2 },
        { price: 400, size: 3 },
      ],
      asks: [
        { price: 400, size: 3 },
        { price: 600, size: 4 },
      ],
    },
    {
      market: 'BTC-ARS',
      bids: [],
      asks: [],
    },
  ];

  describe('calculate spread', () => {
    it('calculate the spread of an orderbooks array', async () => {
      // Arrange
      // (userRepository.findAllAsync as Mock).mockReturnValue(mockUsers);
      const spreads: Spread[] = mockOrderBook.map((orderBook) => {
        const spreadValue = spreadHelper.calculateSpread(orderBook);
        return {
          marketId: orderBook.market,
          spread: spreadValue,
        };
      });
      const spreadBtcClp = spreads[0];
      const spreadEthClp = spreads[1];
      const spreadBtcArs = spreads[2];
      // Assert
      expect(spreadBtcClp.spread).toEqual(300 - 200);
      expect(spreadEthClp.spread).toEqual(400 - 400);
      expect(spreadBtcArs.spread).toEqual(null);
    });
  });
});
