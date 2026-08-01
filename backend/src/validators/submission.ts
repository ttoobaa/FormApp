import { z } from 'zod';

export const submitFormSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});
