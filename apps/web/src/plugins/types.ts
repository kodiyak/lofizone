import type { ReactNode, SVGProps } from 'react';

export type PluginIcon = (props: SVGProps<SVGSVGElement>) => ReactNode;

export type PluginContent = (props: any) => ReactNode;
