import { OpenAPIHono } from '@hono/zod-openapi';

export function getAuthRoutes() {
  const app = new OpenAPIHono();

  return app;
}
