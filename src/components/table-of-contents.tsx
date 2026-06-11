"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { type PortableTextBlock } from "next-sanity";
import { getHeadingId } from "@/lib/heading-id";

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
  additionalContent?: PortableTextBlock[];
  className?: string;
}

function extractHeadings(content: PortableTextBlock[], faqs?: FAQ[], additionalContent?: PortableTextBlock[]): Heading[] {
  const headings: Heading[] = [];
  
  // Extract headings from content
  content.forEach((block) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blockData = block as any;
    if (block._type === 'block' && ['h1', 'h2', 'h3', 'h4'].includes(blockData.style || '')) {
      const text = blockData.children
        ?.map((child: { text?: string }) => child.text || '')
        .join('') || '';
      
      if (text.trim()) {
        const level = parseInt(blockData.style.charAt(1));
        
        headings.push({
          id: getHeadingId(block),
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

  // Extract headings from additional content that appears after FAQ
  if (additionalContent) {
    additionalContent.forEach((block) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blockData = block as any;
      if (block._type === 'block' && ['h1', 'h2', 'h3', 'h4'].includes(blockData.style || '')) {
        const text = blockData.children
          ?.map((child: { text?: string }) => child.text || '')
          .join('') || '';
        
        if (text.trim()) {
          const level = parseInt(blockData.style.charAt(1));
          
          headings.push({
            id: getHeadingId(block),
            text: text.trim(),
            level,
            type: 'heading',
          });
        }
      }
    });
  }
  
  return headings;
}

function scrollToHeading(
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string
) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  event.preventDefault();
  window.history.pushState(null, '', `#${id}`);

  const scrollToElement = () => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (id.startsWith('faq-item-')) {
    const trigger = element.querySelector<HTMLButtonElement>(
      '[data-slot="accordion-trigger"]'
    );

    if (trigger?.getAttribute('aria-expanded') === 'false') {
      trigger.click();
      window.setTimeout(scrollToElement, 200);
      return;
    }
  }

  scrollToElement();
}

export function TableOfContents({ content, faqs, additionalContent, className }: TableOfContentsProps) {
  const headings = useMemo(
    () => extractHeadings(content, faqs, additionalContent),
    [content, faqs, additionalContent]
  );
  const [activeId, setActiveId] = useState<string>('');

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
      <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
        Table of Contents
      </h3>
      <nav className="space-y-0.5">
        {headings.map(({ id, text, level, type }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => scrollToHeading(event, id)}
            aria-current={activeId === id ? 'location' : undefined}
            className={`
              block w-full py-0.5 text-left text-sm leading-5 transition-colors
              hover:text-foreground lg:text-xs lg:leading-4
              ${activeId === id 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground'
              }
              ${level === 1 ? 'pl-0' : ''}
              ${level === 2 ? 'pl-2' : ''}
              ${level === 3 ? 'pl-4' : ''}
              ${level === 4 ? 'pl-6' : ''}
              ${type === 'faq' ? 'italic' : ''}
            `}
          >
            {text}
          </a>
        ))}
      </nav>
    </div>
  );
}
