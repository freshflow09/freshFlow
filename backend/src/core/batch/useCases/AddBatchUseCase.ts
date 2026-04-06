import { BatchRepository } from '../repository/batch.repository';
import { CreateBatchDTO, CreateBatchSchema } from '../dto/CreateBatchDTO';
import { Batch } from '../types/batch.type';
import { AppError } from '../../utils/errors/AppError';

export class AddBatchUseCase {
    constructor(private batchRepository: BatchRepository) {}

    public async execute(data: CreateBatchDTO): Promise<Batch> {
        this.validate(data);

        const session = await this.batchRepository.startSession();
        session.startTransaction();

        try {
            const batch = await this.batchRepository.createBatch({
                productId: data.productId,
                batchNumber: data.batchNumber,
                quantity: data.quantity,
                remainingQuantity: data.quantity,
                costPrice: data.costPrice,
                sellingPrice: data.sellingPrice,
                arrivalDate: data.arrivalDate,
                expiryDate: data.expiryDate,
                status: 'ACTIVE',
                createdBy: data.createdBy
            }, session);

            await this.batchRepository.createLedgerEntry({
                productId: data.productId,
                batchId: batch.id,
                transactionType: 'STOCK_IN',
                quantityChange: data.quantity,
                costInvolved: data.quantity * data.costPrice,
                createdBy: data.createdBy
            }, session);

            await this.batchRepository.incrementProductQuantity(
                data.productId,
                data.quantity,
                session
            );

            await session.commitTransaction();
            session.endSession();

            return batch;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    private validate(data: CreateBatchDTO): void {
        const result = CreateBatchSchema.safeParse(data);
        if (!result.success) {
            throw new AppError(
                `Validation Failed: ${result.error.issues.map((e: any) => e.message).join(', ')}`,
                400
            );
        }

        if (data.expiryDate <= data.arrivalDate) {
            throw new AppError('Expiry date must be after arrival date', 400);
        }
    }
}
