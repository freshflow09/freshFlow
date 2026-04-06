import { z } from 'zod';

export const CreateBatchSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    batchNumber: z.string().min(1, "Batch number is required"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    costPrice: z.coerce.number().min(0, "Cost price must be positive"),
    sellingPrice: z.coerce.number().min(0, "Selling price must be positive"),
    arrivalDate: z.coerce.date(),
    expiryDate: z.coerce.date(),
});

export type CreateBatchDTO = z.infer<typeof CreateBatchSchema> & { createdBy: string };
