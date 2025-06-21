import { createRoute, z, type OpenAPIHono, type RouteConfig } from '@hono/zod-openapi';
import type { ZodSchema } from 'zod';

type BaseRouteConfig = Omit<RouteConfig, 'path' | 'responses' | 'request'>;

type DefineRouteProps<
  P extends string,
  R extends BaseRouteConfig,
  Input extends ZodSchema,
  Output extends ZodSchema,
> = R & {
  app: OpenAPIHono;
  schemas: {
    scope: 'json' | 'form' | 'query' | 'param' | 'header' | 'cookie';
    input: Input;
    output: Output;
  };
  handler: (payload: z.infer<Input>) => z.infer<Output> | Promise<z.infer<Output>>;
  path: P;
};

export function defineRoute<
  P extends string,
  R extends BaseRouteConfig,
  Input extends ZodSchema,
  Output extends ZodSchema,
>({
  app,
  schemas: { input, output, scope },
  handler,
  ...routeConfig
}: DefineRouteProps<P, R, Input, Output>) {
  const route = createRoute({
    ...routeConfig,
    request: { [scope]: { content: { 'application/json': { schema: input } } } },
    responses: {
      200: {
        description: 'Album created successfully',
        content: { 'application/json': { schema: output } },
      },
    },
  });

  // @ts-expect-error: Hono's `app.openapi` expects a function that returns a promise
  app.openapi(route, async (c) => {
    if (scope === 'form') {
      const resulttttt = await c.req.formData();
      const r3 = await c.req.parseBody();
      console.log({ resulttttt, r3 });
    }
    const payload = await c.req.valid(scope as any);
    console.log({ payload, scope });
    const result: z.infer<Output> = output.parse(await handler(payload));
    return c.json(result, 200);
  });
}
