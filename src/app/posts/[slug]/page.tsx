import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { PortableText, type PortableTextBlock } from "next-sanity";

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  author?: { name: string; image?: unknown };
  categories?: { title: string }[];
  mainImage?: { asset: { url: string } };
  body?: PortableTextBlock[];
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
      body
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
  return post;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="py-32">
      <div className="container flex flex-col gap-12 lg:flex-row lg:gap-24">
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
          
          <div className="prose dark:prose-invert max-w-none">
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lead text-lg">{post.excerpt}</p>}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 not-prose">
              <span>Published on {new Date(post.publishedAt).toLocaleDateString()}</span>
              {post.author?.name && <span>by {post.author.name}</span>}
              {post.categories && post.categories.length > 0 && (
                <span>in {post.categories.map((cat) => cat.title).join(", ")}</span>
              )}
            </div>

            {post.body && <PortableText value={post.body} />}
          </div>
        </article>

        <aside className="lg:max-w-[300px]">
          <div className="border-border bg-accent flex flex-col items-start rounded-lg border py-6 md:py-8">
            <div className="mb-8 px-6">
              <Image
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg"
                alt="placeholder"
                width={200}
                height={32}
                className="max-h-8 w-full"
              />
            </div>
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