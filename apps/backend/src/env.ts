import dotenv from 'dotenv';
dotenv.config({ debug: true, override: true });

export const env = {
  port: process.env.PORT || 3000,
  discordToken: process.env.DISCORD_BOT_TOKEN || '',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
};
