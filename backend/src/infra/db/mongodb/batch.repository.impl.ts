import mongoose from 'mongoose';
import { BatchRepository } from '../../../core/batch/repository/batch.repository';
import { Batch } from '../../../core/batch/types/batch.type';
import { StockLedgerEntry, LossReportItem } from '../../../core/batch/types/stockLedger.type';
import { BatchModel } from './batch.schema';
import { StockLedgerModel } from './stockLedger.schema';
import { ProductModel } from './product.schema';
import { AppError } from '../../../core/utils/errors/AppError';

export class MongoBatchRepository implements BatchRepository {

    async createBatch(data: any, session?: mongoose.ClientSession): Promise<Batch> {
        try {
            const [savedBatch] = await BatchModel.create([data], { session });
            return this.mapBatchToDomain(savedBatch);
        } catch (error: any) {
            throw new AppError(error.message, 400);
        }
    }

    async findActiveByProductId(productId: string): Promise<Batch[]> {
        const batches = await BatchModel.find({
            productId: new mongoose.Types.ObjectId(productId),
            status: 'ACTIVE',
            expiryDate: { $gt: new Date() }
        }).sort({ expiryDate: 1 });
        return batches.map(this.mapBatchToDomain);
    }

    async findByProductId(productId: string): Promise<Batch[]> {
        const batches = await BatchModel.find({
            productId: new mongoose.Types.ObjectId(productId)
        }).sort({ expiryDate: 1 });
        return batches.map(this.mapBatchToDomain);
    }

    async updateBatch(id: string, data: Partial<Batch>, session?: mongoose.ClientSession): Promise<Batch | null> {
        const updated = await BatchModel.findByIdAndUpdate(id, data, { new: true, session });
        if (!updated) return null;
        return this.mapBatchToDomain(updated);
    }

    async findNearExpiry(daysThreshold: number): Promise<Batch[]> {
        const now = new Date();
        const thresholdDate = new Date();
        thresholdDate.setDate(now.getDate() + daysThreshold);

        const batches = await BatchModel.find({
            status: 'ACTIVE',
            expiryDate: { $gt: now, $lte: thresholdDate }
        }).sort({ expiryDate: 1 });
        return batches.map(this.mapBatchToDomain);
    }

    async findExpired(): Promise<Batch[]> {
        const batches = await BatchModel.find({
            status: 'ACTIVE',
            expiryDate: { $lte: new Date() }
        }).sort({ expiryDate: 1 });
        return batches.map(this.mapBatchToDomain);
    }

    async getTotalStockByProductId(productId: string): Promise<number> {
        const result = await BatchModel.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(productId),
                    status: 'ACTIVE',
                    expiryDate: { $gt: new Date() }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$remainingQuantity' }
                }
            }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }

    async createLedgerEntry(data: any, session?: mongoose.ClientSession): Promise<StockLedgerEntry> {
        const [entry] = await StockLedgerModel.create([data], { session });
        return this.mapLedgerToDomain(entry);
    }

    async getLossReport(): Promise<LossReportItem[]> {
        const result = await StockLedgerModel.aggregate([
            { $match: { transactionType: 'WASTE' } },
            {
                $group: {
                    _id: '$productId',
                    totalWastedQuantity: { $sum: { $abs: '$quantityChange' } },
                    totalLossCost: { $sum: '$costInvolved' }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: { $toString: '$_id' },
                    totalWastedQuantity: 1,
                    totalLossCost: 1
                }
            }
        ]);
        return result;
    }

    async incrementProductQuantity(productId: string, amount: number, session?: mongoose.ClientSession): Promise<void> {
        await ProductModel.findByIdAndUpdate(
            productId,
            { $inc: { totalAvailableQuantity: amount } },
            { session }
        );
    }

    async decrementProductQuantity(productId: string, amount: number, session?: mongoose.ClientSession): Promise<void> {
        await ProductModel.findByIdAndUpdate(
            productId,
            { $inc: { totalAvailableQuantity: -amount } },
            { session }
        );
    }

    async startSession(): Promise<mongoose.ClientSession> {
        return await mongoose.startSession();
    }

    private mapBatchToDomain(doc: any): Batch {
        return {
            id: doc._id.toString(),
            productId: doc.productId.toString(),
            batchNumber: doc.batchNumber,
            quantity: doc.quantity,
            remainingQuantity: doc.remainingQuantity,
            costPrice: doc.costPrice,
            sellingPrice: doc.sellingPrice,
            arrivalDate: doc.arrivalDate,
            expiryDate: doc.expiryDate,
            status: doc.status,
            createdBy: doc.createdBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    private mapLedgerToDomain(doc: any): StockLedgerEntry {
        return {
            id: doc._id.toString(),
            productId: doc.productId.toString(),
            batchId: doc.batchId.toString(),
            transactionType: doc.transactionType,
            quantityChange: doc.quantityChange,
            costInvolved: doc.costInvolved,
            createdBy: doc.createdBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}
