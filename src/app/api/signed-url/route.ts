import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws-config";

export async function POST(request: NextRequest) {
    try {
        const { fileName, fileType, folder } = await request.json();

        if (!fileName || !fileType) {
            return NextResponse.json({ error: "Missing file data" }, { status: 400 });
        }

        const fileExtension = fileName.split(".").pop();
        const key = `${folder || "uploads"}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        return NextResponse.json({ uploadUrl, key }); // return only key
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
    }
}
