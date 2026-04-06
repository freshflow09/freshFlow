export interface StockLedgerEntry {
    id?: string;
    productId: string;
    batchId: string;
    transactionType: 'STOCK_IN' | 'SALE' | 'WASTE';
    quantityChange: number;
    costInvolved: number;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LossReportItem {
    productId: string;
    totalWastedQuantity: number;
    totalLossCost: number;
}
