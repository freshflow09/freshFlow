import { BatchRepository } from '../repository/batch.repository';
import { IssueStockDTO, IssueStockSchema } from '../dto/IssueStockDTO';
import { StockLedgerEntry } from '../types/stockLedger.type';
import { AppError } from '../../utils/errors/AppError';

export class IssueStockUseCase {
    constructor(private batchRepository: BatchRepository) {}

    public async execute(data: IssueStockDTO): Promise<{ deductions: StockLedgerEntry[]; totalDeducted: number }> {
        this.validate(data);

        const session = await this.batchRepository.startSession();
        session.startTransaction();

        try {
            const activeBatches = await this.batchRepository.findActiveByProductId(data.productId);

            const totalAvailable = activeBatches.reduce((sum, b) => sum + b.remainingQuantity, 0);
            if (totalAvailable < data.requestedQuantity) {
                throw new AppError(
                    `Insufficient stock. Available: ${totalAvailable}, Requested: ${data.requestedQuantity}`,
                    400
                );
            }

            let remaining = data.requestedQuantity;
            const ledgerEntries: StockLedgerEntry[] = [];

            for (const batch of activeBatches) {
                if (remaining <= 0) break;

                const deductFromBatch = Math.min(batch.remainingQuantity, remaining);
                const newRemaining = batch.remainingQuantity - deductFromBatch;
                const newStatus = newRemaining === 0 ? 'DEPLETED' : 'ACTIVE';

                await this.batchRepository.updateBatch(
                    batch.id!,
                    { remainingQuantity: newRemaining, status: newStatus },
                    session
                );

                const ledgerEntry = await this.batchRepository.createLedgerEntry({
                    productId: data.productId,
                    batchId: batch.id,
                    transactionType: data.transactionType,
                    quantityChange: -deductFromBatch,
                    costInvolved: deductFromBatch * batch.costPrice,
                    createdBy: data.createdBy
                }, session);

                ledgerEntries.push(ledgerEntry);
                remaining -= deductFromBatch;
            }

            await this.batchRepository.decrementProductQuantity(
                data.productId,
                data.requestedQuantity,
                session
            );

            await session.commitTransaction();
            session.endSession();

            return {
                deductions: ledgerEntries,
                totalDeducted: data.requestedQuantity
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    private validate(data: IssueStockDTO): void {
        const result = IssueStockSchema.safeParse(data);
        if (!result.success) {
            throw new AppError(
                `Validation Failed: ${result.error.issues.map((e: any) => e.message).join(', ')}`,
                400
            );
        }
    }
}
