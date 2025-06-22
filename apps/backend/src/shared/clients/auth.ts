import { env } from '@/env';
import { createAuth } from '@workspace/auth';
import { db } from './db';

export const auth = createAuth({
  db,
  baseURL: env.serverUrl,
  secret: env.authSecret,
  socialProviders: {
    discord: {
      clientId: env.discordClientId,
      clientSecret: env.discordClientSecret,
    },
  },
});
