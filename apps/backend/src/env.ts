import dotenv from 'dotenv';
dotenv.config({ debug: true, override: true });

export const env = {
  name: 'Jumal AI',
  voice: 'GUDYcgRAONiI1nXDcNQQ',
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
  evolutionApiToken: process.env.EVOLUTION_API_TOKEN,
  evolutionApiSession: process.env.EVOLUTION_API_SESSION,
  s3: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    bucket: process.env.AWS_BUCKET!,
    endpoint: process.env.AWS_ENDPOINT!,
  },
  redis: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  },
};
