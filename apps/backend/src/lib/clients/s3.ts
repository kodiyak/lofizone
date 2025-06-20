import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../env';

export const s3 = new S3Client({
  region: env.s3.region,
  endpoint: env.s3.endpoint,
  credentials: {
    accessKeyId: env.s3.accessKeyId,
    secretAccessKey: env.s3.secretAccessKey,
  },
});

export async function uploadFile({ file, path }: { path: string; file: Buffer }) {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.s3.bucket,
      Key: path,
      Body: file,
    }),
  );

  return path;
}

export async function signedUrl({
  path,
  expiresIn = 60 * 60,
}: {
  path: string;
  expiresIn?: number;
}) {
  const command = new GetObjectCommand({
    Bucket: env.s3.bucket,
    Key: path,
  });

  const url = await getSignedUrl(s3, command, { expiresIn }).catch(() => null);
  return url;
}
