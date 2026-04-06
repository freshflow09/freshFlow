export interface Batch {
    id?: string;
    productId: string;
    batchNumber: string;
    quantity: number;
    remainingQuantity: number;
    costPrice: number;
    sellingPrice: number;
    arrivalDate: Date;
    expiryDate: Date;
    status: 'ACTIVE' | 'DEPLETED' | 'EXPIRED';
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}
