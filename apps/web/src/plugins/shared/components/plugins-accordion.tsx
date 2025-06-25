import type { Api } from '@workspace/core';
import React from 'react';
import { PluginProvider } from '../providers/plugin-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';

interface PluginsAccordionProps {
  room: Api.Room;
}

export default function PluginsAccordion({ room }: PluginsAccordionProps) {
  return (
    <>
      <Accordion type="single" collapsible>
        {room.plugins.map((plugin) => (
          <AccordionItem
            value={`plugin.${plugin.id}`}
            key={`plugin.${plugin.id}`}
          >
            <AccordionTrigger className="px-6">{plugin.id}</AccordionTrigger>
            <AccordionContent>
              <PluginProvider plugin={plugin} room={room} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
