import { z } from 'zod';

export const CreateProductSchema = z.object({
    productName: z.string().min(3, "Name must be at least 3 characters"),
    category: z.string().min(1, "Category is required"),
    brand: z.string().optional(),
    unitType: z.enum(['kg', 'box', 'lit', 'pcs', 'dozen'], { message: "Invalid unit type" }),
    supplierName: z.string().optional(),
    storageType: z.string().optional(),
    sellingPrice: z.coerce.number().min(0, "Selling Price must be positive"),
    images: z.array(z.string().url("Valid Cloudinary/S3 URL is required")).min(1, "At least one image is required"),
    videoUrl: z.string().url("Must be a valid URL").optional(),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema> & { createdBy: string };