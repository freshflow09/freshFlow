import { Router } from 'express';
import { BatchController } from '../controller/batch.controller';
import { AddBatchUseCase } from '../useCases/AddBatchUseCase';
import { IssueStockUseCase } from '../useCases/IssueStockUseCase';
import { GetBatchesByProductUseCase } from '../useCases/GetBatchesByProductUseCase';
import { GetNearExpiryBatchesUseCase } from '../useCases/GetNearExpiryBatchesUseCase';
import { GetExpiryLossReportUseCase } from '../useCases/GetExpiryLossReportUseCase';
import { MongoBatchRepository } from '../../../infra/db/mongodb/batch.repository.impl';

const router = Router();

const batchRepository = new MongoBatchRepository();

const addBatchUseCase = new AddBatchUseCase(batchRepository);
const issueStockUseCase = new IssueStockUseCase(batchRepository);
const getBatchesByProductUseCase = new GetBatchesByProductUseCase(batchRepository);
const getNearExpiryBatchesUseCase = new GetNearExpiryBatchesUseCase(batchRepository);
const getExpiryLossReportUseCase = new GetExpiryLossReportUseCase(batchRepository);

const batchController = new BatchController(
    addBatchUseCase,
    issueStockUseCase,
    getBatchesByProductUseCase,
    getNearExpiryBatchesUseCase,
    getExpiryLossReportUseCase
);

router.post('/add', batchController.addBatch);
router.post('/issue', batchController.issueStock);
router.get('/product/:productId', batchController.getBatchesByProduct);
router.get('/near-expiry', batchController.getNearExpiryBatches);
router.get('/loss-report', batchController.getLossReport);

export default router;
