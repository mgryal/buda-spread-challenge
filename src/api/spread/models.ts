import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Spread = z.infer<typeof SpreadSchema>;
export const SpreadSchema = z.object({
  value: z.number(),
  marketId: z.string(),
});

export const SpreadsSchema = z.array(SpreadSchema);

// Input Validation for 'GET users/:id' endpoint
export const GetSpreadSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const AlertSchema = z.object({
  alertValue: z.number(),
  // marketId: z.string(),
});

export const SpreadPolling = z.object({
  params: z.object({ marketId: z.string() }),
});

export const SpreadPollingResponse = z.object({
  isGreaterThanAlert: z.boolean(),
  marketId: z.string(),
  spread: z.number(),
});

export const SpreadsPollingResponse = z.array(SpreadPollingResponse);

export const SetAlertSchema = z.object({
  body: AlertSchema,
});

export const AlertSchemaResponse = z.null();
