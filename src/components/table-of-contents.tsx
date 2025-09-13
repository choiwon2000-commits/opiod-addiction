"use client"

import React, { useEffect, useState } from 'react';
import { type PortableTextBlock } from "next-sanity";

interface FAQ {
  _key: string;
  question: string;
  answer: PortableTextBlock[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
  type: 'heading' | 'faq';
}

interface TableOfContentsProps {
  content: PortableTextBlock[];
  faqs?: FAQ[];
  className?: string;
}

function extractHeadings(content: PortableTextBlock[], faqs?: FAQ[]): Heading[] {
  const headings: Heading[] = [];
  
  // Extract headings from content
  content.forEach((block, blockIndex) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blockData = block as any;
    if (block._type === 'block' && ['h1', 'h2', 'h3', 'h4'].includes(blockData.style || '')) {
      const text = blockData.children
        ?.map((child: { text?: string }) => child.text || '')
        .join('') || '';
      
      if (text.trim()) {
        const level = parseInt(blockData.style.charAt(1));
        const id = `heading-${blockIndex}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        
        headings.push({
          id,
          text: text.trim(),
          level,
          type: 'heading',
        });
      }
    }
  });
  
  // Add FAQ section and individual FAQ items if there are FAQs
  if (faqs && faqs.length > 0) {
    headings.push({
      id: 'faq-section',
      text: 'FAQ',
      level: 2,
      type: 'faq',
    });
    
    // Add each FAQ question as a sub-item
    faqs.forEach((faq) => {
      headings.push({
        id: `faq-item-${faq._key}`,
        text: faq.question,
        level: 3,
        type: 'faq',
      });
    });
  }
  
  return headings;
}

function scrollToHeading(id: string) {
  const element = document.getElementById(id);
  if (element) {
    // If it's an FAQ item, try to open the accordion first
    if (id.startsWith('faq-item-')) {
      const trigger = element.querySelector('[data-slot="accordion-trigger"]') as HTMLButtonElement;
      if (trigger && trigger.getAttribute('aria-expanded') === 'false') {
        trigger.click();
        // Wait for the accordion to open before scrolling
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
        return;
      }
    }
    
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start',
    });
  }
}

export function TableOfContents({ content, faqs, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const extractedHeadings = extractHeadings(content, faqs);
    setHeadings(extractedHeadings);
  }, [content, faqs]);

  useEffect(() => {
    // Intersection Observer to track which heading is currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold mb-4">Table of Contents</h3>
      <nav className="space-y-1">
        {headings.map(({ id, text, level, type }) => (
          <button
            key={id}
            onClick={() => scrollToHeading(id)}
            className={`
              block text-left text-sm transition-colors hover:text-foreground w-full
              ${activeId === id 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground'
              }
              ${level === 1 ? 'pl-0' : ''}
              ${level === 2 ? 'pl-3' : ''}
              ${level === 3 ? 'pl-6' : ''}
              ${level === 4 ? 'pl-9' : ''}
              ${type === 'faq' ? 'italic' : ''}
            `}
          >
            {text}
          </button>
        ))}
      </nav>
    </div>
  );
}