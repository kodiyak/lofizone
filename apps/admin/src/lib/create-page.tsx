import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router';
import * as React from 'react';
import { ErrorBoundary } from '@workspace/ui/components/error-boundary';

export interface ICreatePage {
  path: string;
  element?: ReactNode;
  lazy?: () => Promise<{ default: React.ComponentType<any> }>;
  children?: ICreatePage[];
  parser?: (lazy: string) => string;
}

export function createPage({
  path,
  children,
  element,
  lazy,
  parser,
}: ICreatePage): RouteObject {
  const ComponentLazy = lazy ? React.lazy(lazy) : null;
  const el = (
    <>
      {element}
      {ComponentLazy && (
        <React.Suspense>
          <ComponentLazy />
        </React.Suspense>
      )}
    </>
  );
  return {
    path,
    element: (
      <>
        <React.Suspense fallback={'Loading...'}>
          <ErrorBoundary fallback={(err) => <>- {err?.message}</>}>
            {el}
          </ErrorBoundary>
        </React.Suspense>
      </>
    ),
    children: children?.map((child) => createPage({ ...child, parser })) ?? [],
  };
}
