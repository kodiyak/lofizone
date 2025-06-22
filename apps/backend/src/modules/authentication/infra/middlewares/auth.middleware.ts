import { auth } from '@/shared/clients/auth';
import type { Handler } from 'hono';

export const authMiddleware: Handler = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  console.log('Session retrieved:', { session, headers: c.req.raw.headers });

  if (!session) {
    console.error('Unauthorized access attempt detected');
    return c.json(
      {
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource.',
      },
      401,
    );
  }

  console.log('Authenticated user:', session.user.id);
  c.set('session', session);
  await next();
};
