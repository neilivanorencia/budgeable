import { z } from "zod";

/**
 * Validation schema rule parsing single, optional entity identifiers from dynamic path route variables.
 */
export const idParamSchema = z.object({ id: z.string().optional() });

/**
 * Validation schema wrapper safeguarding payload matrices during multi-row structural removal operations.
 */
export const bulkDeleteSchema = z.object({ ids: z.array(z.string()) });
