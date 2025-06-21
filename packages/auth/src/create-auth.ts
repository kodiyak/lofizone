import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { bearer, jwt } from 'better-auth/plugins';
import { generateId } from '@workspace/core';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@workspace/db';

interface AuthConfig {
  db: PrismaClient;
  secret: string;
  baseURL: string;
  socialProviders: {
    github: {
      clientId: string;
      clientSecret: string;
      scope: string[];
    };
  };
}

export function createAuth(config: AuthConfig) {
  return betterAuth({
    plugins: [nextCookies(), jwt(), bearer()],
    secret: config.secret,
    baseURL: config.baseURL,
    socialProviders: {
      github: {
        clientId: config.socialProviders.github.clientId,
        clientSecret: config.socialProviders.github.clientSecret,
        scope: config.socialProviders.github.scope,
      },
    },
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
