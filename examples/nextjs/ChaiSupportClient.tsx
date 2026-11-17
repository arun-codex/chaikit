'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Next.js SSR-safe dynamic import
const ChaiSupportComponent = dynamic(
  () => import('@chaikit/react').then((mod) => mod.ChaiSupport),
  { ssr: false }
);

export interface ChaiSupportProps {
  creatorName: string;
  upiId: string;
  description?: string;
  theme?: 'classic' | 'dark' | 'cream' | 'minimal' | 'auto';
  position?: 'bottom-right' | 'bottom-left' | 'inline';
}

export function ChaiSupport(props: ChaiSupportProps) {
  return (
    <ChaiSupportComponent
      creatorName={props.creatorName}
      upiId={props.upiId}
      description={props.description}
      theme={props.theme || 'auto'}
      position={props.position || 'bottom-right'}
    />
  );
}
