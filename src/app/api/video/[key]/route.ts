import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws-config";

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
    try {
        const key = decodeURIComponent(params.key);

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        return NextResponse.json({ signedUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Cannot generate video URL" }, { status: 500 });
    }
}
