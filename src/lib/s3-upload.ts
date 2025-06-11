import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './aws-config';


export interface UploadResponse {
    success: boolean;
    url?: string;
    key?: string;
    error?: string;
}


export const uploadFileToS3 = async ( file: File,folder: string = 'uploads'): Promise<UploadResponse> => {
    try {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return { success: true, url: fileUrl, key: fileName, };
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred', };
    }
};

export const uploadMultipleFiles = async (
    files: { file: File; folder: string }[]
): Promise<UploadResponse[]> => {
    const uploadPromises = files.map(({ file, folder }) =>
        uploadFileToS3(file, folder)
    );

    return await Promise.all(uploadPromises);
};