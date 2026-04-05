import mongoose, { Schema, Document } from 'mongoose';


export interface IProductDocument extends Document {
    productName: string;
    category: string;
    brand: string;
    
    unitType: string;
    supplierName: string;
    storageType: string;
    quantity: number;
    
    costPrice: number;
    sellingPrice: number;
    
    arrivalDate: Date;
    expiryDate: Date;

    images: string[];
    videoUrl?: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>({
    productName: { 
        type: String, 
        required: true, 
        trim: true, 
        index: true 
    },
    category: { 
        type: String, 
        required: true, 
        trim: true,
        lowercase: true,
        index: true 
    },
    brand: { 
        type: String, 
        trim: true, 
        default: 'Generic' 
    },

    unitType: { 
        type: String, 
        required: true,
        enum: ['kg', 'box', 'lit', 'pcs', 'dozen'], 
        lowercase: true
    },
    supplierName: { 
        type: String, 
        trim: true, 
        default: 'Unknown' 
    },
    storageType: { 
        type: String, 
        trim: true,
        default: 'Room Temp'
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: [0, 'Quantity cannot be negative'] 
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
        required: true 
    },

    images: {
        type: [String],
        required: true,
        validate: [
            (val: string[]) => val.length > 0,
            'Product must have at least one image URL'
        ]
    },
    videoUrl: {
        type: String,
        trim: true,
        default: null
    },

    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    }

}, { 
    timestamps: true, 
    versionKey: false 
});

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);