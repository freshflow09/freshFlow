import { ProductRepository } from './repository/product.repository';
import { Product } from './types/product.type';

export class GetAllProductsUseCase {
    constructor(private productRepository: ProductRepository) {}
    
    public async execute(): Promise<Product[]> {
        return await this.productRepository.getAllProducts();
    }
}
