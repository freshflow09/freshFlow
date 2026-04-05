import { Router } from "express";
import { ProductController } from "../controller/product.controller";
import { CreateProductUseCase } from "../CreateProductUseCase";
import { GetProductUseCase } from "../GetProductUseCase";
import { GetAllProductsUseCase } from "../GetAllProductsUseCase";
import { MongoProductRepository } from "../../../infra/db/mongodb/product.repository.impl";
import { CloudinaryMediaService } from "../../../infra/cloudinary/CloudinaryMediaService";

const router = Router();


const productRepository = new MongoProductRepository();
const mediaService = new CloudinaryMediaService();

const createProductUseCase = new CreateProductUseCase(productRepository);
const getProductUseCase = new GetProductUseCase(productRepository);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);

const productController = new ProductController(
    createProductUseCase,
    getProductUseCase,
    getAllProductsUseCase,
    mediaService
);

import { upload } from "../middleware/multer.middleware";
router.post("/create", upload.fields([
    { name: 'images', maxCount: 10 }, 
    { name: 'video', maxCount: 1 }
]), productController.createProduct);
router.get("/upload-signature", productController.getUploadSignature);
router.get("/getPorduct/:id", productController.getProduct);
router.get("/", productController.getAllProducts);

export default router;