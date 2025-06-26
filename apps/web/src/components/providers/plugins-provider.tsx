'use client';

import React, { type PropsWithChildren } from 'react';
import { PluginsProvider as CorePluginsProvider } from '@plugins/core';
import { availablePlugins } from '@/lib/available-plugins';

export default function PluginsProvider({ children }: PropsWithChildren) {
  return (
    <CorePluginsProvider plugins={availablePlugins}>
      {children}
    </CorePluginsProvider>
  );
}
