import { BatchRepository } from '../repository/batch.repository';
import { LossReportItem } from '../types/stockLedger.type';

export class GetExpiryLossReportUseCase {
    constructor(private batchRepository: BatchRepository) {}

    public async execute(): Promise<LossReportItem[]> {
        return await this.batchRepository.getLossReport();
    }
}
