import { Request, Response, NextFunction } from 'express';
import { AddBatchUseCase } from '../useCases/AddBatchUseCase';
import { IssueStockUseCase } from '../useCases/IssueStockUseCase';
import { GetBatchesByProductUseCase } from '../useCases/GetBatchesByProductUseCase';
import { GetNearExpiryBatchesUseCase } from '../useCases/GetNearExpiryBatchesUseCase';
import { GetExpiryLossReportUseCase } from '../useCases/GetExpiryLossReportUseCase';

export class BatchController {
    constructor(
        private addBatchUseCase: AddBatchUseCase,
        private issueStockUseCase: IssueStockUseCase,
        private getBatchesByProductUseCase: GetBatchesByProductUseCase,
        private getNearExpiryBatchesUseCase: GetNearExpiryBatchesUseCase,
        private getExpiryLossReportUseCase: GetExpiryLossReportUseCase
    ) {}

    public addBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = {
                ...req.body,
                createdBy: (req as any).user?.id || '507f1f77bcf86cd799439011'
            };

            const newBatch = await this.addBatchUseCase.execute(payload);

            res.status(201).json({
                success: true,
                message: 'Batch added successfully (Stock-In)',
                data: newBatch
            });
        } catch (error) {
            next(error);
        }
    };

    public issueStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = {
                ...req.body,
                createdBy: (req as any).user?.id || '507f1f77bcf86cd799439011'
            };

            const result = await this.issueStockUseCase.execute(payload);

            res.status(200).json({
                success: true,
                message: `Stock issued successfully. ${result.totalDeducted} units deducted via FIFO.`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    public getBatchesByProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const productId = req.params.productId as string;
            const batches = await this.getBatchesByProductUseCase.execute(productId);

            res.status(200).json({
                success: true,
                results: batches.length,
                data: batches
            });
        } catch (error) {
            next(error);
        }
    };

    public getNearExpiryBatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const days = parseInt(req.query.days as string) || 7;
            const batches = await this.getNearExpiryBatchesUseCase.execute(days);

            res.status(200).json({
                success: true,
                results: batches.length,
                thresholdDays: days,
                data: batches
            });
        } catch (error) {
            next(error);
        }
    };

    public getLossReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const report = await this.getExpiryLossReportUseCase.execute();

            res.status(200).json({
                success: true,
                results: report.length,
                data: report
            });
        } catch (error) {
            next(error);
        }
    };
}
