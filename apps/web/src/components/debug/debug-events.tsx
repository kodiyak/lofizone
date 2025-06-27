'use client';

import { useRoomController } from '@/lib/store/use-room-controller';
import type { RoomTrackerEventsData } from '@workspace/core';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { useEffect, useState } from 'react';

export default function DebugEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const controller = useRoomController((state) => state.controller);

  const pipe = (event: keyof RoomTrackerEventsData) => {
    const onHandler = (payload: any) => {
      console.log(`Event received: ${event}`, payload);
      setEvents((prev) => [...prev, { event, data: payload }]);
    };

    console.log(`Listening to event: ${event}`, { controller });

    return controller.on(event, onHandler as any);
  };

  useEffect(() => {
    const tunnelEvents = [
      pipe('plugin_event'),
      pipe('plugin_started'),
      pipe('plugin_stopped'),
      pipe('plugin_settings_updated'),
      pipe('plugin_state_updated'),
      pipe('plugin_installed'),
      pipe('plugin_uninstalled'),
      pipe('player_paused'),
      pipe('player_seeked'),
      pipe('track_changed'),
      pipe('track_added'),
      pipe('track_removed'),
      pipe('member_joined'),
      pipe('member_left'),
    ];

    return () => {
      tunnelEvents.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <Card className="w-[33vw] h-full">
      <CardHeader>
        <CardTitle>Debugger ({events.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <Accordion type="multiple">
          {events.map((event, i) => (
            <AccordionItem key={i} value={`event-${i}`}>
              <AccordionTrigger>
                <span className="flex-1">{event.event}</span>
                {event.data.timestamp && (
                  <>
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }).format(new Date(event.data.timestamp))}
                  </>
                )}
                {event.data.fromMe && <Badge>Me</Badge>}
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <pre className="text-xs text-muted-foreground p-2 rounded-lg bg-background/30 border">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
