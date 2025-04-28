import { z } from "zod";

export const idParamSchema = z.object({ id: z.string().optional() });

export const bulkDeleteSchema = z.object({ ids: z.array(z.string()) });
