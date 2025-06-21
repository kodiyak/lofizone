import { OpenAPIHono, z } from '@hono/zod-openapi';

export function addTracksRoutes() {
  const app = new OpenAPIHono();

  return app;
}
