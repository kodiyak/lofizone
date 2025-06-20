import PromptCard from '@/components/prompts/prompt-card';
import React from 'react';

const Page: React.FC = () => {
  return (
    <>
      <div className="flex flex-col mx-auto w-full max-w-2xl py-8">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 12 }, (_, index) => (
            <PromptCard key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
