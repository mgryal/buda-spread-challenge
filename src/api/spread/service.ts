import { StatusCodes } from 'http-status-codes';

import { spreadRepository } from '@/api/spread/repository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { spreadHelper } from './helper';
import { Spread, SpreadAlert } from './types';

export const spreadService = {
  spreadAlertValue: 0,
  findAll: async (): Promise<ServiceResponse<Spread[] | null>> => {
    try {
      const orderBooks = await spreadRepository.getAllOrders();
      const spreads = orderBooks.map((orderBook) => {
        const spreadValue = spreadHelper.calculateSpread(orderBook);
        return {
          marketId: orderBook.market,
          spread: spreadValue,
        };
      });
      if (!orderBooks) {
        return new ServiceResponse(ResponseStatus.Failed, 'No order books found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Spread[]>(ResponseStatus.Success, 'Spreads calculated', spreads, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error calculating spread values: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  setAlert: async function (spreadValue: number): Promise<ServiceResponse<SpreadAlert | null>> {
    try {
      this.spreadAlertValue = spreadValue;
      return new ServiceResponse(
        ResponseStatus.Success,
        'Alert setted',
        { spreadAlertValue: this.spreadAlertValue },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error setting spreadAlertValue ${spreadValue}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  polling: async function (): Promise<ServiceResponse<Spread[] | null>> {
    try {
      const orderBooks = await spreadRepository.getAllOrders();
      const spreads = orderBooks.map((orderBook) => {
        const spreadValue = spreadHelper.calculateSpread(orderBook);
        if (!spreadValue) {
          return {
            marketId: orderBook.market,
            spread: spreadValue,
          };
        }
        return {
          marketId: orderBook.market,
          isGreaterThanAlert: spreadValue > this.spreadAlertValue,
          spread: spreadValue,
        };
      });
      return new ServiceResponse<Spread[]>(ResponseStatus.Success, 'Spreads calculated', spreads, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error calculating spreads: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  pollingById: async function (marketId: string): Promise<ServiceResponse<Spread | null>> {
    try {
      const orderBook = await spreadRepository.getOrderbyMarket(marketId);
      if (!orderBook) {
        return new ServiceResponse(ResponseStatus.Failed, 'Order book not found', null, StatusCodes.NOT_FOUND);
      }
      const spreadValue = spreadHelper.calculateSpread(orderBook);
      if (!spreadValue) {
        return new ServiceResponse(ResponseStatus.Failed, 'Spread not calculated', null, StatusCodes.NOT_FOUND);
      }
      const spread = { marketId, isGreaterThanAlert: spreadValue > this.spreadAlertValue, spread: spreadValue };
      return new ServiceResponse<Spread>(ResponseStatus.Success, 'Spread calculated', spread, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error calculating spread with marketId ${marketId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
