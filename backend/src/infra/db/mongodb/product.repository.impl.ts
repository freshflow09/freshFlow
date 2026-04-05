import { ProductRepository } from "../../../core/product/repository/product.repository";
import { Product } from "../../../core/product/types/product.type";
import { ProductModel } from "./product.schema";
import { AppError } from "../../../core/utils/errors/AppError";

export class MongoProductRepository implements ProductRepository {
    async createProduct(data: any): Promise<Product> {
        try {
            const newProduct = new ProductModel(data);
            const savedProduct = await newProduct.save();
            return this.mapToDomain(savedProduct);
        } catch (error: any) {
            throw new AppError(error.message, 400);
        }
    }

    async getProduct(id: string): Promise<Product | null> {
        const product = await ProductModel.findById(id);
        if (!product) return null;
        return this.mapToDomain(product);
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await ProductModel.find();
        return products.map(this.mapToDomain);
    }

    private mapToDomain(doc: any): Product {
        return {
            id: doc._id.toString(),
            productName: doc.productName,
            category: doc.category,
            brand: doc.brand,
            unitType: doc.unitType,
            supplierName: doc.supplierName,
            storageType: doc.storageType,
            quantity: doc.quantity,
            costPrice: doc.costPrice,
            sellingPrice: doc.sellingPrice,
            arrivalDate: doc.arrivalDate,
            expiryDate: doc.expiryDate,
            images: doc.images,
            videoUrl: doc.videoUrl,
            createdBy: doc.createdBy.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}