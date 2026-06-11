import type { PortableTextBlock } from "next-sanity";

type HeadingBlock = PortableTextBlock & {
  _key?: string;
  children?: Array<{ text?: string }>;
};

export function getHeadingId(block: PortableTextBlock): string {
  const heading = block as HeadingBlock;

  if (heading._key) {
    return `heading-${heading._key}`;
  }

  const text = heading.children
    ?.map((child) => child.text || "")
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");

  return `heading-${text || "section"}`;
}
