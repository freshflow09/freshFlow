import mongoose, { Schema, Document } from 'mongoose';

export interface IBatchDocument extends Document {
    productId: mongoose.Types.ObjectId;
    batchNumber: string;
    quantity: number;
    remainingQuantity: number;
    costPrice: number;
    sellingPrice: number;
    arrivalDate: Date;
    expiryDate: Date;
    status: 'ACTIVE' | 'DEPLETED' | 'EXPIRED';
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BatchSchema = new Schema<IBatchDocument>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    batchNumber: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    remainingQuantity: {
        type: Number,
        required: true,
        min: [0, 'Remaining quantity cannot be negative']
    },
    costPrice: {
        type: Number,
        required: true,
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DEPLETED', 'EXPIRED'],
        default: 'ACTIVE',
        index: true
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

BatchSchema.index({ productId: 1, status: 1, expiryDate: 1 });

export const BatchModel = mongoose.model<IBatchDocument>('Batch', BatchSchema);
