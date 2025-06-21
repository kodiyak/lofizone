import dotenv from 'dotenv';
dotenv.config({ debug: true, override: true });

export const env = {
  port: process.env.PORT || 3000,
  discordToken: process.env.DISCORD_BOT_TOKEN || '',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
  s3: {
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION!,
    endpoint: process.env.S3_ENDPOINT!,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
};
