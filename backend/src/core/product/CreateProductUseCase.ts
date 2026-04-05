import { ProductRepository } from './repository/product.repository';
import { CreateProductDTO, CreateProductSchema } from './dto/CreateProductDTO';
import { Product } from './types/product.type';
import { AppError } from '../utils/errors/AppError';
export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}
    public async execute(data: CreateProductDTO): Promise<Product> {
        this.validateRules(data);
        
        const savedProduct = await this.productRepository.createProduct(data);
        
        return savedProduct;
    }

   

    private validateRules(data: CreateProductDTO): void {
        const result = CreateProductSchema.safeParse(data);
        if (!result.success) {
            throw new AppError(`Validation Failed: ${result.error.issues.map((e: any) => e.message).join(', ')}`, 400);
        }
    }
}