import UiBackground from '@/components/ui-background';
import { useUiStore } from '@/lib/store/use-ui-store';
import { themes } from '@/lib/themes';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';

export default function RoomThemesScreen() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <Card key={theme.title} className="w-full aspect-square relative">
            <UiBackground
              src={theme.background?.src}
              className="size-full absolute inset-0 object-cover -z-10 opacity-20 rounded-3xl overflow-hidden"
              imgClassName="size-full object-cover"
            />
            <CardContent className="text-center h-full gap-6">
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <CardTitle>{theme.title}</CardTitle>
                  <CardDescription>{theme.description}</CardDescription>
                </div>
              </div>
              <Button
                variant={'outline'}
                onClick={() => {
                  useUiStore.setState((state) => ({
                    ...theme,
                  }));
                }}
              >
                Apply Theme
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
