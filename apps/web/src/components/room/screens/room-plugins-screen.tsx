import { availablePlugins } from '@/lib/available-plugins';
import { PluginProvider } from '@plugins/core';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';

export default function RoomPluginsScreen() {
  const plugins = Object.values(availablePlugins);
  return (
    <>
      <div className="flex flex-col px-4">
        <div className="grid grid-cols-4 max-w-full gap-4">
          {plugins.map((plugin) => (
            <Card key={plugin.name}>
              <div className="flex items-start gap-4 px-6">
                <div className="size-12 rounded-xl border bg-background bg-gradient-to-br from-card/70 to-background flex items-center justify-center">
                  <PluginProvider
                    name={plugin.name}
                    componentName={'Icon'}
                    plugins={availablePlugins}
                    className={'size-8'}
                  />
                </div>
                <CardHeader className="px-0 flex-1">
                  <CardTitle>{plugin.title}</CardTitle>
                  <CardDescription>{plugin.description}</CardDescription>
                </CardHeader>
              </div>
              <CardFooter className="justify-end">
                <Button size={'sm'}>Install Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
