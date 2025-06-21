import { createRoute, z, type OpenAPIHono, type RouteConfig } from '@hono/zod-openapi';
import type { ZodObject } from 'zod';

type BaseRouteConfig = Omit<RouteConfig, 'path' | 'responses' | 'request'>;

type DefineRouteProps<
  P extends string,
  R extends BaseRouteConfig,
  Input extends ZodObject<any>,
  Output extends ZodObject<any>,
> = R & {
  app: OpenAPIHono;
  schemas: {
    input: Input;
    output: Output;
  };
  handler: (payload: z.infer<Input>) => z.infer<Output> | Promise<z.infer<Output>>;
  path: P;
};

export function defineRoute<
  P extends string,
  R extends BaseRouteConfig,
  Input extends ZodObject<any>,
  Output extends ZodObject<any>,
>({
  app,
  schemas: { input, output },
  handler,
  ...routeConfig
}: DefineRouteProps<P, R, Input, Output>) {
  const route = createRoute({
    ...routeConfig,
    request:
      routeConfig.method === 'post'
        ? { body: { content: { 'application/json': { schema: input } } } }
        : undefined,
    parameters:
      routeConfig.method !== 'post'
        ? { query: { content: { 'application/json': { schema: input } } } }
        : undefined,
    responses: {
      200: {
        description: 'Album created successfully',
        content: { 'application/json': { schema: output } },
      },
    },
  });

  // @ts-expect-error: Hono's `app.openapi` expects a function that returns a promise
  app.openapi(route, async (c) => {
    const result: z.infer<Output> = output.parse(
      await handler(input.parse(await c.req.valid('json' as any))),
    );
    return c.json(result, 200);
  });
}
