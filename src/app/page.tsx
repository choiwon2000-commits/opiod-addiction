import Link from "next/link";
import { client } from "@/sanity/lib/client";

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  author?: { name: string; image?: unknown };
  categories?: { title: string }[];
  mainImage?: { asset: { url: string } };
  body?: any;
}

async function getPosts(): Promise<Post[]> {
  const posts = await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      author->{name, image},
      categories[]->{title},
      mainImage{asset->{url}},
      body
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return posts;
}

const Home = async () => {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <section className="py-32">
        <div className="container">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
            <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
            <p className="text-muted-foreground">
              Create your first post in the Sanity Studio at{" "}
              <Link href="/studio" className="underline hover:text-foreground">
                /studio
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post, index) => (
        <section key={post.slug?.current} className="py-32">
          <div className="container flex flex-col gap-12 lg:flex-row lg:gap-24">
            <article className="mx-auto">
              <Link href={`/posts/${post.slug?.current}`} className="block">
                <img
                  src={post.mainImage?.asset?.url || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"}
                  alt={post.title}
                  className="mb-8 aspect-video w-full max-w-3xl rounded-lg border object-cover hover:opacity-90 transition-opacity"
                />
              </Link>
              <div className="prose dark:prose-invert">
                <Link href={`/posts/${post.slug?.current}`} className="no-underline">
                  <h1 className="hover:text-primary transition-colors cursor-pointer">{post.title}</h1>
                </Link>
                {post.excerpt && <p className="lead">{post.excerpt}</p>}
                <p>
                  Published on {new Date(post.publishedAt).toLocaleDateString()}
                  {post.author?.name && ` by ${post.author.name}`}
                </p>
                {post.categories && post.categories.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Categories: {post.categories.map((cat) => cat.title).join(", ")}
                  </p>
                )}
                <Link 
                  href={`/posts/${post.slug?.current}`}
                  className="inline-block mt-4 text-primary hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>

            <aside className="lg:max-w-[300px]">
              <div className="border-border bg-accent flex flex-col items-start rounded-lg border py-6 md:py-8">
                <div className="mb-8 px-6">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg"
                    alt="placeholder"
                    className="max-h-8 w-full"
                  />
                </div>
                <div className="mb-5 px-6 last:mb-0">
                  <div className="mb-2 text-xs font-semibold">Post #{index + 1}</div>
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
                  <div className="mb-2 text-xs font-semibold">Studio</div>
                  <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                    <Link href="/studio" className="hover:text-foreground underline">
                      Edit in Sanity Studio
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home
