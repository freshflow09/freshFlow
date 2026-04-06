import mongoose, { Schema, Document } from 'mongoose';

export interface IStockLedgerDocument extends Document {
    productId: mongoose.Types.ObjectId;
    batchId: mongoose.Types.ObjectId;
    transactionType: 'STOCK_IN' | 'SALE' | 'WASTE';
    quantityChange: number;
    costInvolved: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const StockLedgerSchema = new Schema<IStockLedgerDocument>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: true,
        index: true
    },
    transactionType: {
        type: String,
        enum: ['STOCK_IN', 'SALE', 'WASTE'],
        required: true,
        index: true
    },
    quantityChange: {
        type: Number,
        required: true
    },
    costInvolved: {
        type: Number,
        required: true,
        min: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

StockLedgerSchema.index({ productId: 1, transactionType: 1 });

export const StockLedgerModel = mongoose.model<IStockLedgerDocument>('StockLedger', StockLedgerSchema);
