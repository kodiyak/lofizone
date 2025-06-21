import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { bearer, jwt } from 'better-auth/plugins';
import { generateId } from '@workspace/core';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@workspace/db';

interface AuthConfig {
  db: PrismaClient;
  secret: string;
  baseURL: string;
  socialProviders: BetterAuthOptions['socialProviders'];
}

export function createAuth(config: AuthConfig) {
  return betterAuth({
    plugins: [nextCookies(), jwt(), bearer()],
    secret: config.secret,
    baseURL: config.baseURL,
    socialProviders: config.socialProviders,
    user: { modelName: 'User' },
    account: { modelName: 'Account' },
    verification: { modelName: 'Verification' },
    session: { modelName: 'Session' },
    advanced: {
      database: {
        generateId: ({ model }) => {
          return generateId(model.slice(0, 2));
        },
      },
      crossSubDomainCookies: { enabled: true },
    },
    database: prismaAdapter(config.db, {
      provider: 'postgresql',
    }),
  });
}
