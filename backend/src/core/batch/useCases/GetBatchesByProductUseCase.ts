import { BatchRepository } from '../repository/batch.repository';
import { Batch } from '../types/batch.type';

export class GetBatchesByProductUseCase {
    constructor(private batchRepository: BatchRepository) {}

    public async execute(productId: string): Promise<Batch[]> {
        return await this.batchRepository.findByProductId(productId);
    }
}
