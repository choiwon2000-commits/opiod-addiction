import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { type PortableTextBlock } from "next-sanity";
import { FAQAccordion } from "@/components/faq-accordion";
import { TableOfContents } from "@/components/table-of-contents";
import { PortableTextWithHeadings } from "@/components/portable-text-with-headings";

interface FAQ {
  _key: string;
  question: string;
  answer: PortableTextBlock[];
}

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  author?: { name: string; image?: unknown };
  categories?: { title: string }[];
  mainImage?: { asset: { url: string } };
  body?: PortableTextBlock[];
  faqs?: FAQ[];
  additionalContent?: PortableTextBlock[];
}

async function getPost(slug: string): Promise<Post | null> {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      title,
      slug,
      publishedAt,
      excerpt,
      author->{name, image},
      categories[]->{title},
      mainImage{asset->{url}},
      body,
      faqs[]{
        _key,
        question,
        answer
      },
      additionalContent
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
  return post;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="py-32 max-w-7xl justify-center flex mx-auto px-6">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
        <article className="mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
              ← Back to all posts
            </Link>
          </div>
          
          {post.mainImage?.asset?.url && (
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              width={768}
              height={432}
              className="mb-8 aspect-video w-full max-w-3xl rounded-lg border object-cover"
            />
          )}
          
          <div className="flex flex-col gap-2 prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-semibold">{post.title}</h1>
            {post.excerpt && <p className="lead text-lg">{post.excerpt}</p>}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 not-prose">
              <span>Published on {new Date(post.publishedAt).toLocaleDateString()}</span>
              {post.author?.name && <span>by {post.author.name}</span>}
              {post.categories && post.categories.length > 0 && (
                <span>in {post.categories.map((cat) => cat.title).join(", ")}</span>
              )}
            </div>

            {post.body && <PortableTextWithHeadings value={post.body} />}
          </div>

          {/* Mobile Table of Contents - shown after content on mobile */}
          {(post.body || (post.faqs && post.faqs.length > 0) || post.additionalContent) && (
            <div className="lg:hidden mt-8 border-border bg-accent/50 flex flex-col items-start rounded-lg border py-6">
              <div className="px-6 w-full">
                <TableOfContents 
                  content={post.body || []} 
                  faqs={post.faqs} 
                  additionalContent={post.additionalContent}
                />
              </div>
            </div>
          )}

          {post.faqs && post.faqs.length > 0 && (
            <div id="faq-section" className="scroll-mt-20">
              <FAQAccordion 
                faqs={post.faqs} 
                className="mt-12 max-w-none"
              />
            </div>
          )}

          {post.additionalContent && (
            <div className="prose dark:prose-invert max-w-none mt-12">
              <PortableTextWithHeadings value={post.additionalContent} />
            </div>
          )}
        </article>

        <aside className="lg:max-w-[500px] w-full">
          <div className="border-border bg-accent flex flex-col items-start rounded-lg border py-6 md:py-8">
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Post</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                {post.title}
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Author</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                {post.author?.name || "Anonymous"}
              </div>
            </div>
            <div className="border-border mb-5 w-full border-t px-6 pt-5 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Published</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Categories</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                {post.categories && post.categories.length > 0
                  ? post.categories.map((cat) => cat.title).join(", ")
                  : "Uncategorized"}
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Actions</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm space-y-1">
                <div>
                  <Link href="/" className="hover:text-foreground underline block">
                    ← All Posts
                  </Link>
                </div>
                <div>
                  <Link href="/studio" className="hover:text-foreground underline block">
                    Edit in Studio
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table of Contents - hidden on mobile */}
          {(post.body || (post.faqs && post.faqs.length > 0) || post.additionalContent) && (
            <div className="hidden lg:flex border-border bg-accent/50 flex-col items-start rounded-lg border py-6 md:py-8 mt-6">
              <div className="px-6 w-full">
                <TableOfContents 
                  content={post.body || []} 
                  faqs={post.faqs} 
                  additionalContent={post.additionalContent}
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const posts = await client.fetch(
    `*[_type == "post"]{ slug }`
  );

  return posts.map((post: { slug: { current: string } }) => ({
    slug: post.slug.current,
  }));
}