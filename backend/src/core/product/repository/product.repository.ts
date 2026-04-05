import { Product } from "../types/product.type";

export interface ProductRepository {
  createProduct(data: any): Promise<Product>;
  getProduct(id: string): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
}