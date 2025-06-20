import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import React from 'react';

const Page: React.FC = () => {
  return (
    <>
      <ResizablePanelGroup
        className="w-screen h-screen!"
        direction="horizontal"
      >
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default Page;
