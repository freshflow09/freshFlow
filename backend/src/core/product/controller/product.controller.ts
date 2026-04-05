import { Request, Response, NextFunction } from 'express';
import { CreateProductUseCase } from './../CreateProductUseCase';
import { GetProductUseCase } from '../GetProductUseCase';
import { GetAllProductsUseCase } from '../GetAllProductsUseCase';
import { IMediaService } from '../ports/Product.media';
import { AppError } from '../../utils/errors/AppError';

export class ProductController {
    constructor(
        private createProductUseCase: CreateProductUseCase,
        private getProductUseCase: GetProductUseCase,
        private getAllProductsUseCase: GetAllProductsUseCase,
        private mediaService: IMediaService
    ) { }

    public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const uploadedImageUrls: string[] = [];
            let uploadedVideoUrl: string | undefined = undefined;

            const filesObj = (req as any).files as { [fieldname: string]: any[] } | undefined;

            if (filesObj && filesObj['images'] && filesObj['images'].length > 0) {
                for (const file of filesObj['images']) {
                    try {
                        const url = await this.mediaService.uploadImage({
                            path: file.path,
                            mimetype: file.mimetype,
                            size: file.size,
                            originalname: file.originalname
                        });
                        uploadedImageUrls.push(url);
                    } finally {
                        const fs = require('fs');
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    }
                }
            }


            if (filesObj && filesObj['video'] && filesObj['video'].length > 0) {
                for (const file of filesObj['video']) {
                    try {
                        const url = await this.mediaService.uploadVideo({
                            path: file.path,
                            mimetype: file.mimetype,
                            size: file.size,
                            originalname: file.originalname
                        });
                        uploadedVideoUrl = url;
                    } finally {
                        const fs = require('fs');
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    }
                }
            }


            let existingImages = req.body.images || [];
            if (typeof existingImages === 'string') {
                existingImages = [existingImages];
            }

            const finalImages = [...uploadedImageUrls, ...existingImages];
            const finalVideoUrl = uploadedVideoUrl || req.body.videoUrl;

            const payload = {
                ...req.body,
                images: finalImages,
                videoUrl: finalVideoUrl,
                createdBy: (req as any).user?.id || '507f1f77bcf86cd799439011'
            };

            const newProduct = await this.createProductUseCase.execute(payload);

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            next(error);
        }
    };

    public getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const product = await this.getProductUseCase.execute(id);

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            next(error);
        }
    };

    public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const products = await this.getAllProductsUseCase.execute();

            res.status(200).json({
                success: true,
                results: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    };

    public getUploadSignature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const signatureData = await this.mediaService.generateUploadSignature('freshflow_products');

            res.status(200).json({
                success: true,
                data: signatureData
            });
        } catch (error) {
            next(new AppError("Failed to generate upload signature", 500));
        }
    }
}