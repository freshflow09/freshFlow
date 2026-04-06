import { z } from 'zod';

export const IssueStockSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    requestedQuantity: z.coerce.number().int().min(1, "Requested quantity must be at least 1"),
    transactionType: z.enum(['SALE', 'WASTE'], { message: "Transaction type must be SALE or WASTE" }),
});

export type IssueStockDTO = z.infer<typeof IssueStockSchema> & { createdBy: string };
