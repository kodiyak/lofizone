import { RoomsService } from '@/modules/rooms-management';
import { db } from '@/shared/clients/db';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { PluginsRegistry } from '@plugins/core';

export function getPluginsRoutes() {
  const app = new OpenAPIHono();

  // install, uninstall, [put] settings
  app.openapi(
    {
      method: 'post',
      path: '/plugins/:pluginId/install',
      responses: {
        200: {
          description: 'Plugin installed successfully',
          content: {
            'application/json': {
              schema: z.object({
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
        500: {
          description: 'Internal server error',
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

      const room = RoomsService.getInstance().getRoom(roomId);
      if (!room) {
        return c.json({ message: `Room ${roomId} not found` }, 404);
      }

      const pluginRegistry = PluginsRegistry.getInstance().getPlugin(pluginId);
      if (!pluginRegistry) {
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

      const roomPlugin = await db.roomPlugin.create({
        data: {
          room: { connect: { id: roomId } },
          pluginId,
          settings: pluginRegistry.settings.defaultValues,
        },
      });

      const plugin = RoomsService.getInstance()
        .getRoom(roomId)
        ?.plugins.addPlugin({
          id: roomPlugin.id,
          name: pluginRegistry.name,
          installedAt: new Date(),
          settings: pluginRegistry.settings.schema.parse(roomPlugin.settings),
        });
      if (!plugin) {
        return c.json({ message: `Failed to add plugin ${pluginId} to room ${roomId}` }, 500);
      }

      plugin.install();

      return c.json({ message: `Plugin ${pluginId} installed successfully` }, 200);
    },
  );

  app.openapi(
    {
      method: 'post',
      path: '/plugins/:pluginId/uninstall',
      responses: {
        200: {
          description: 'Plugin uninstalled successfully',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string().optional(),
              }),
            },
          },
        },
        404: {
          description: 'Plugin or room not found',
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
          pluginId: z.string().describe('ID of the plugin to uninstall'),
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
      description: 'Uninstall a plugin from a room by its ID',
    },
    async (c) => {
      const { pluginId } = c.req.valid('param');
      const { roomId } = c.req.valid('json');

      const room = RoomsService.getInstance().getRoom(roomId);
      if (!room) {
        return c.json({ message: `Room ${roomId} not found` }, 404);
      }

      const plugin = room.plugins.getPlugin(pluginId);
      if (!plugin) {
        return c.json({ message: `Plugin ${pluginId} not found in room ${roomId}` }, 404);
      }

      console.log(`Uninstalling plugin: ${pluginId} from room: ${roomId}`);

      await db.roomPlugin.delete({
        where: { roomId_pluginId: { roomId, pluginId } },
      });
      plugin.uninstall();

      // plugin.RoomsService.getInstance().getRoom(roomId)?.plugins.removePlugin(pluginId);

      return c.json({ message: `Plugin ${pluginId} uninstalled successfully` }, 200);
    },
  );

  return app;
}
