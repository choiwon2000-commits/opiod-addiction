"use client"

import React from 'react';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

interface PortableTextWithHeadingsProps {
  value: PortableTextBlock[];
  className?: string;
}

function generateHeadingId(block: PortableTextBlock, blockIndex: number): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blockData = block as any;
  const text = blockData.children
    ?.map((child: { text?: string }) => child.text || '')
    .join('') || '';
  return `heading-${blockIndex}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      const imageUrl = urlFor(value).width(800).height(600).url();
      
      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || ''}
            width={800}
            height={600}
            className="rounded-lg border object-cover w-full"
          />
          {value.alt && (
            <p className="text-sm text-muted-foreground mt-2 text-center italic">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children, value, index = 0 }) => (
      <h1 id={generateHeadingId(value, index)} className="scroll-mt-20">
        {children}
      </h1>
    ),
    h2: ({ children, value, index = 0 }) => (
      <h2 id={generateHeadingId(value, index)} className="scroll-mt-20">
        {children}
      </h2>
    ),
    h3: ({ children, value, index = 0 }) => (
      <h3 id={generateHeadingId(value, index)} className="scroll-mt-20">
        {children}
      </h3>
    ),
    h4: ({ children, value, index = 0 }) => (
      <h4 id={generateHeadingId(value, index)} className="scroll-mt-20">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a 
          href={value?.href} 
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableTextWithHeadings({ value, className }: PortableTextWithHeadingsProps) {
  return (
    <div className={className}>
      <PortableText 
        value={value} 
        components={components}
      />
    </div>
  );
}