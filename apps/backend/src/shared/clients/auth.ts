import { env } from '@/env';
import { createAuth } from '@workspace/auth';
import { db } from './db';

export const auth = createAuth({
  db,
  secret: env.authSecret,
  baseURL: env.serverUrl,
  socialProviders: {
    discord: {
      clientId: env.discordClientId,
      clientSecret: env.discordClientSecret,
    },
  },
});
