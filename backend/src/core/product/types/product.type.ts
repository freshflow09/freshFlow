export interface Product {
  id?: string;
  productName: string;
  category: string;
  brand?: string;
  unitType: string;
  supplierName?: string;
  storageType?: string;
  sellingPrice: number;
  totalAvailableQuantity: number;
  images: string[];
  videoUrl?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}