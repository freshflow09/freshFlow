import { Batch } from '../types/batch.type';
import { StockLedgerEntry, LossReportItem } from '../types/stockLedger.type';

export interface BatchRepository {
    createBatch(data: any, session?: any): Promise<Batch>;
    findActiveByProductId(productId: string): Promise<Batch[]>;
    findByProductId(productId: string): Promise<Batch[]>;
    updateBatch(id: string, data: Partial<Batch>, session?: any): Promise<Batch | null>;
    findNearExpiry(daysThreshold: number): Promise<Batch[]>;
    findExpired(): Promise<Batch[]>;
    getTotalStockByProductId(productId: string): Promise<number>;

    createLedgerEntry(data: any, session?: any): Promise<StockLedgerEntry>;
    getLossReport(): Promise<LossReportItem[]>;

    incrementProductQuantity(productId: string, amount: number, session?: any): Promise<void>;
    decrementProductQuantity(productId: string, amount: number, session?: any): Promise<void>;

    startSession(): Promise<any>;
}
