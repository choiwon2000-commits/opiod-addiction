"use client"

import React from 'react';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
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
      if (!value?.asset?.url) {
        return null;
      }

      return (
        <div className="my-8">
          <Image
            src={value.asset.url}
            alt={value.alt || value.caption || ''}
            width={800}
            height={600}
            className="rounded-lg border object-cover w-full"
          />
          {(value.alt || value.caption) && (
            <p className="text-sm text-muted-foreground mt-2 text-center italic">
              {value.alt || value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children, value, index = 0 }) => (
      <h1 id={generateHeadingId(value, index)} className="scroll-mt-20 text-4xl font-bold mt-8 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children, value, index = 0 }) => (
      <h2 id={generateHeadingId(value, index)} className="scroll-mt-20 text-3xl font-semibold mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children, value, index = 0 }) => (
      <h3 id={generateHeadingId(value, index)} className="scroll-mt-20 text-2xl font-semibold mt-5 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children, value, index = 0 }) => (
      <h4 id={generateHeadingId(value, index)} className="scroll-mt-20 text-xl font-medium mt-4 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 italic my-6 text-muted-foreground bg-accent/50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-7">
        {children}
      </p>
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
          className="text-primary hover:underline underline decoration-primary/30 hover:decoration-primary transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-7">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="leading-7">
        {children}
      </li>
    ),
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