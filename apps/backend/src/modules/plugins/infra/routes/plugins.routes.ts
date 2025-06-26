import { db } from '@/shared/clients/db';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { PluginsRegistry } from '@plugins/core';

export function getPluginsRoutes() {
  const app = new OpenAPIHono();

  // install, uninstall, [put] settings
  app.openapi(
    {
      method: 'post',
      path: '/:pluginId/install',
      responses: {
        200: {
          description: 'Plugin installed successfully',
          content: {
            'application/json': {
              schema: z.object({
                success: z.boolean(),
                message: z.string().optional(),
              }),
            },
          },
        },
        404: {
          description: 'Plugin not found',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
        },
        400: {
          description: 'Plugin not found',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
        },
      },
      request: {
        params: z.object({
          pluginId: z.string().describe('ID of the plugin to install'),
        }),
        body: {
          content: {
            'application/json': {
              schema: z.object({
                roomId: z.string(),
              }),
            },
          },
        },
      },
      description: 'Install a plugin by its ID',
    },
    async (c) => {
      const { pluginId } = c.req.valid('param');
      const { roomId } = c.req.valid('json');

      const plugin = PluginsRegistry.getInstance().getPlugin(pluginId);
      if (!plugin) {
        return c.json({ message: `Plugin ${pluginId} not found` }, 404);
      }

      const exists = await db.roomPlugin.findUnique({
        where: {
          roomId_pluginId: { roomId, pluginId },
        },
        select: { id: true },
      });
      if (exists) {
        return c.json(
          { message: `Plugin ${pluginId} is already installed in room ${roomId}` },
          400,
        );
      }

      console.log(`Installing plugin: ${pluginId} for room: ${roomId}`);
      console.log(plugin);

      await db.roomPlugin.create({
        data: {
          room: { connect: { id: roomId } },
          pluginId,
          settings: plugin.settings.defaultValues,
        },
      });
      // Logic to install the plugin
      // For example, you might call a service to handle the installation
      // const result = await pluginService.install(pluginId);

      return c.json({ success: true, message: `Plugin ${pluginId} installed successfully` }, 200);
    },
  );

  return app;
}
