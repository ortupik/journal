'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { ScrollArea } from '@/components/ui/scroll-area';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const SwaggerPage = () => {
  return (
    <ScrollArea className='h-[calc(100dvh-10px)]'>
      <SwaggerUI url='/api/docs' />;
    </ScrollArea>
  );
};

export default SwaggerPage;
