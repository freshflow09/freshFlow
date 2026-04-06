import { BatchRepository } from '../repository/batch.repository';
import { Batch } from '../types/batch.type';

export class GetNearExpiryBatchesUseCase {
    constructor(private batchRepository: BatchRepository) {}

    public async execute(daysThreshold: number = 7): Promise<Batch[]> {
        return await this.batchRepository.findNearExpiry(daysThreshold);
    }
}
