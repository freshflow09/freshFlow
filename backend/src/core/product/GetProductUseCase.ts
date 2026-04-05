import { ProductRepository } from './repository/product.repository';
import { Product } from './types/product.type';
import { AppError } from '../utils/errors/AppError';

export class GetProductUseCase {
    constructor(private productRepository: ProductRepository) {}
    
    public async execute(id: string): Promise<Product> {
        if (!id) {
            throw new AppError("Product ID is required", 400);
        }
        
        const product = await this.productRepository.getProduct(id);
        
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        
        return product;
    }
}
