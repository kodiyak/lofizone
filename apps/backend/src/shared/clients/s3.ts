import { env } from '@/env';
import s3mini from 's3mini';

export const s3Client = new s3mini(env.s3);
