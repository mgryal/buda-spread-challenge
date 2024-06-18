import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { spreadRepository } from '../repository';
import { spreadService } from '../service';
import { OrderBook, Spread, SpreadAlert } from '../types';

vi.mock('@/api/spread/repository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));
const mockOrderBooks: OrderBook[] = [
  {
    market: 'BTC-USD',
    asks: [
      { price: 150, size: 10 },
      { price: 100, size: 20 },
    ],
    bids: [
      { price: 90, size: 10 },
      { price: 95, size: 20 },
    ],
  },
  {
    market: 'ETH-USD',
    asks: [
      { price: 200, size: 10 },
      { price: 201, size: 20 },
    ],
    bids: [
      { price: 102, size: 10 },
      { price: 105, size: 20 },
    ],
  },
];

const mockSpreads: Spread[] = [
  {
    marketId: 'BTC-USD',
    spread: 5,
  },
  {
    marketId: 'ETH-USD',
    spread: 95,
  },
];

const mockAlertSpreads: Spread[] = [
  {
    marketId: 'BTC-USD',
    isGreaterThanAlert: false,
    spread: 5,
  },
  {
    marketId: 'ETH-USD',
    isGreaterThanAlert: true,
    spread: 95,
  },
];

describe('Spread service', () => {
  describe('findAll', () => {
    it('return all spread', async () => {
      // Arrange
      (spreadRepository.getAllOrders as Mock).mockReturnValue(mockOrderBooks);

      // Act
      const result = await spreadService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Spreads calculated');
      expect(result.responseObject).toEqual(mockSpreads);
    });
  });

  describe('setAlert', () => {
    it('set alert in spread service object', async () => {
      const mockedAlert: SpreadAlert = {
        spreadAlertValue: 1000,
      };
      const result = await spreadService.setAlert(1000);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Alert setted');
      expect(result.responseObject).toEqual(mockedAlert);
    });
  });
  describe('polling', () => {
    it('returns the comparison between the spread alert value and the spreads of all order books', async () => {
      // Arrange
      (spreadRepository.getAllOrders as Mock).mockReturnValue(mockOrderBooks);

      // Act
      await spreadService.setAlert(50);
      const result = await spreadService.polling();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Spreads calculated');
      expect(result.responseObject).toEqual(mockAlertSpreads);
    });
  });
  describe('pollingById', () => {
    it('returns the comparison between the spread alert value and the order book spread of the marketId', async () => {
      // Arrange
      (spreadRepository.getOrderbyMarket as Mock).mockReturnValue(mockOrderBooks[0]);

      // Act
      const result = await spreadService.pollingById('BTC-USD');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Spread calculated');
      expect(result.responseObject).toEqual(mockAlertSpreads[0]);
    });
  });
});
