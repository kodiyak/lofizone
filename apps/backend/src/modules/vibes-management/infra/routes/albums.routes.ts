import { OpenAPIHono, z } from '@hono/zod-openapi';
import { defineRoute } from '@/shared/infra/define-route';

export function getAlbumsRoutes() {
  const app = new OpenAPIHono();

  defineRoute({
    method: 'post',
    path: '/',
    app,
    schemas: {
      input: z.object({
        name: z.string().nonempty(),
        artist: z.string().nonempty(),
      }),
      output: z.object({
        id: z.string(),
      }),
    },
    handler: async (payload) => {
      return { id: '12345', ...payload };
    },
  });

  return app;
}
