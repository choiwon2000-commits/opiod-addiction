import Link from "next/link";
import { client } from "@/sanity/lib/client";

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  author?: { name: string; image?: unknown };
  categories?: { title: string }[];
}

async function getPosts(): Promise<Post[]> {
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...5] {
      title,
      slug,
      publishedAt,
      excerpt,
      author->{name, image},
      categories[]->{title}
    }
  `);
  return posts;
}

const Home = async () => {
  const posts = await getPosts();

  return (
    <section className="py-32">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-24">
        <article className="mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
            <p className="text-lg text-muted-foreground">
              Latest posts from our content management system
            </p>
          </div>
          
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <div key={post.slug?.current} className="border-b pb-8">
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.author?.name && <span>By {post.author.name}</span>}
                    {post.publishedAt && (
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    )}
                    {post.categories && post.categories.length > 0 && (
                      <span>
                        {post.categories.map((cat) => cat.title).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground">
                Create your first post in the Sanity Studio at{" "}
                <Link href="/studio" className="underline hover:text-foreground">
                  /studio
                </Link>
              </p>
            </div>
          )}
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
              <div className="mb-2 text-xs font-semibold">Company</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                Suspendisse vel euismod sem. Sed sollicitudin augue eu facilisis
                scelerisque. Nullam pharetra tortor ut massa accumsan egestas.
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Industry</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                Suspendisse volutpat
              </div>
            </div>
            <div className="border-border mb-5 w-full border-t px-6 pt-5 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Location</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                London, United Kingdom
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Company size</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                11-50
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Website</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                <a href="#" className="hover:text-foreground underline">
                  https://example.com/
                </a>
              </div>
            </div>
            <div className="mb-5 px-6 last:mb-0">
              <div className="mb-2 text-xs font-semibold">Topics</div>
              <div className="text-muted-foreground overflow-hidden text-xs md:text-sm">
                Sed sollicitudin augue eu facilisis scelerisque
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Home
