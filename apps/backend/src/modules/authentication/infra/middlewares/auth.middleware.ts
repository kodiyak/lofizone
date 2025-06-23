import { auth } from '@/shared/clients/auth';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import type { Handler } from 'hono';
import { env } from '@/env';

const JWKS = createRemoteJWKSet(new URL('/api/auth/jwks', env.authUrl));

async function validateToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.authIssuer,
      audience: env.authAudience,
    });
    return payload;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export const authMiddleware: Handler = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (session) {
    c.set('userId', session.user.id);
  } else {
    const authToken = c.req.header('Authorization')?.replace('Bearer ', '');
    if (authToken) {
      const payload = await validateToken(authToken).catch((err) => err.payload);
      if (payload && payload.id) {
        c.set('userId', payload.id);
      }
    }
  }

  const userId = c.get('userId');

  if (userId) {
    console.log(`Authenticated user ID: ${userId}`);
  }

  await next();
};
