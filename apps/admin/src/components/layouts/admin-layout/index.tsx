import { ScrollArea } from '@workspace/ui/components/scroll-area';
import React, { type PropsWithChildren } from 'react';

const AdminLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ScrollArea className="w-screen h-screen overflow-hidden">
        {children}
      </ScrollArea>
    </>
  );
};

export default AdminLayout;
