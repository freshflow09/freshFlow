export interface FileInput {
    path: string;
    mimetype: string;
    size: number;
    originalname: string;
}


export interface IMediaService {
    uploadImage(file: FileInput): Promise<string>;
    uploadVideo(file: FileInput): Promise<string>;

    generateUploadSignature(folderName: string): Promise<{
        signature: string;
        timestamp: number;
        cloudName: string;
        apiKey: string;
    }>;

    deleteMedia(publicUrl: string): Promise<boolean>;
}