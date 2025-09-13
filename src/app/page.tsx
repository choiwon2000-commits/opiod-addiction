import { client } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";
import { PillIcon } from "lucide-react";

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  author?: { name: string; image?: unknown };
  categories?: { title: string }[];
  mainImage?: { asset: { url: string } };
  body?: unknown;
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

  return (
    <section className="w-screen h-screen mx-auto flex justify-center items-center">
      <div className="container">
        <div className="flex flex-col items-center gap-5">
          <PillIcon className="size-12 text-[#00aeff]" />
          <h2 className="text-center text-3xl font-semibold">
            Bewust gebruik
            <br />
            <span className="text-muted-foreground/80">
              Voor een gezonder en beter leven
            </span>
          </h2>
          <div className="flex items-center gap-4">
            {posts.map((post) => {
              return (
                <Button
                  size="lg"
                  key={post.slug.current}
                  variant="outline"
                  asChild
                >
                  <a
                    href={`/posts/${post.slug.current}`}
                    target="_blank"
                  >
                    {post.title}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
