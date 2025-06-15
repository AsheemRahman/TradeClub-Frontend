import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3-upload';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf',
            'video/mp4',
            'video/avi',
            'video/mov',
            'video/wmv',
            'video/quicktime'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'File type not allowed' },
                { status: 400 }
            );
        }

        const result = await uploadFileToS3(file, folder);

        if (result.success) {
            return NextResponse.json({
                success: true,
                url: result.url,
                key: result.key,
            });
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json( { error: 'Internal server error' }, { status: 500 });
    }
}