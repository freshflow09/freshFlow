export interface Product {
  id?: string;
  productName: string;
  category: string;
  brand?: string;
  unitType: string;
  supplierName?: string;
  storageType?: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  arrivalDate: Date;
  expiryDate: Date;
  images: string[];
  videoUrl?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}