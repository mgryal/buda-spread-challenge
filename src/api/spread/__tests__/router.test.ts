import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';

import { Spread, SpreadAlert } from '../types';

describe('Spread API Endpoints', () => {
  describe('GET /spreads', () => {
    it('should return a list of all spreads', async () => {
      // Act
      const response = await request(app).get('/spreads');
      const responseBody: ServiceResponse<Spread[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Spreads calculated');
    });
  });

  describe('POST /spreads/alert', () => {
    it('should set alert value in service object', async () => {
      // Act
      const payload = { alertValue: 1000 };
      const response = await request(app)
        .post('/spreads/alert')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      const responseBody: ServiceResponse<SpreadAlert> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Alert setted');
      expect(responseBody.responseObject.spreadAlertValue).toEqual(payload.alertValue);
    });
  });

  describe('GET /spreads/polling', () => {
    it('should return the list of spreads compared with the alert value', async () => {
      // Act
      const alertPayload = { alertValue: 1000 };
      await request(app)
        .post('/spreads/alert')
        .send(alertPayload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      const response = await request(app).get('/spreads/polling');
      const responseBody: ServiceResponse<Spread[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Spreads calculated');
    });
  });
  describe('GET /spreads/polling/:id', () => {
    it('should return the spread of marketId compared with the alert value', async () => {
      // Act
      const alertPayload = { alertValue: 1000 };
      await request(app)
        .post('/spreads/alert')
        .send(alertPayload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      const response = await request(app).get('/spreads/polling/BTC-CLP');
      const responseBody: ServiceResponse<Spread> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Spread calculated');
      expect(responseBody.responseObject.marketId).toEqual('BTC-CLP');
    });
  });
});

// function compareUsers(mockUser: User, responseUser: User) {
//   if (!mockUser || !responseUser) {
//     throw new Error('Invalid test data: mockUser or responseUser is undefined');
//   }

//   expect(responseUser.id).toEqual(mockUser.id);
//   expect(responseUser.name).toEqual(mockUser.name);
//   expect(responseUser.email).toEqual(mockUser.email);
//   expect(responseUser.age).toEqual(mockUser.age);
//   expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
//   expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
// }
