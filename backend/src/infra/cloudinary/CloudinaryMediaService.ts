import { v2 as cloudinary } from 'cloudinary';
import { IMediaService, FileInput } from '../../core/product/ports/Product.media';
import { log } from 'console';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryMediaService implements IMediaService {
    public async uploadImage(file: FileInput): Promise<string> {
        return this.uploadLocalFileToCloudinary(file.path, 'image');
    }

    public async uploadVideo(file: FileInput): Promise<string> {
        return this.uploadLocalFileToCloudinary(file.path, 'video');
    }

    public async generateUploadSignature(folderName: string) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder: folderName },
            process.env.CLOUDINARY_API_SECRET!
        );

        return {
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
            apiKey: process.env.CLOUDINARY_API_KEY!,
        };
    }

    public async deleteMedia(publicUrl: string): Promise<boolean> {
        try {
            const publicId = this.extractPublicId(publicUrl);
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('[Cloudinary Error] Delete failed:', error);
            return false;
        }
    }

    private async uploadLocalFileToCloudinary(filePath: string, resourceType: 'image' | 'video'): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: resourceType,
                folder: 'freshflow_products',
            });
            console.log("upload image on claudenary")
            return result.secure_url;
        } catch (error) {
            console.error(`[Cloudinary Error] Failed to upload ${resourceType}:`, error);
            throw new Error(`Failed to upload ${resourceType}`);
        }
    }

    private extractPublicId(url: string): string {
        const parts = url.split('/');
        const fileWithExt = parts.pop();
        const folder = parts.pop();
        const fileName = fileWithExt?.split('.')[0];
        return `${folder}/${fileName}`;
    }
}