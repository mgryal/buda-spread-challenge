import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import {
  AlertSchema,
  AlertSchemaResponse,
  SetAlertSchema,
  SpreadPolling,
  SpreadPollingResponse,
  SpreadSchema,
  SpreadsPollingResponse,
} from '@/api/spread/models';
import { createApiRequest, createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { spreadService } from './service';

export const spreadRegistry = new OpenAPIRegistry();

spreadRegistry.register('Spread', SpreadSchema);

export const spreadRouter: Router = (() => {
  const router = express.Router();

  spreadRegistry.registerPath({
    method: 'get',
    path: '/spreads',
    tags: ['Spread'],
    responses: createApiResponse(z.array(SpreadSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await spreadService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  spreadRegistry.registerPath({
    method: 'post',
    path: '/spreads/alert',
    tags: ['Spread'],
    request: createApiRequest(AlertSchema),
    responses: createApiResponse(AlertSchemaResponse, 'Success'),
  });

  router.post('/alert', validateRequest(SetAlertSchema), async (req: Request, res: Response) => {
    const alertValue = parseInt(req.body.alertValue as string, 10);
    const serviceResponse = await spreadService.setAlert(alertValue);
    handleServiceResponse(serviceResponse, res);
  });

  spreadRegistry.registerPath({
    method: 'get',
    path: '/spreads/polling',
    tags: ['Spread'],
    responses: createApiResponse(SpreadsPollingResponse, 'Success'),
  });

  router.get('/polling', async (req: Request, res: Response) => {
    const serviceResponse = await spreadService.polling();
    handleServiceResponse(serviceResponse, res);
  });

  spreadRegistry.registerPath({
    method: 'get',
    path: '/spreads/polling/{marketId}',
    tags: ['Spread'],
    request: { params: SpreadPolling.shape.params },
    responses: createApiResponse(SpreadPollingResponse, 'Success'),
  });

  router.get('/polling/:marketId', async (req: Request, res: Response) => {
    const { marketId } = req.params;
    const serviceResponse = await spreadService.pollingById(marketId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
