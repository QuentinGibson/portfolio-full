import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/blog.server";
import { blogPost } from "~/models/blog.server";

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Blog" }
  ]
}


export const loader = async ({ request, params }: LoaderArgs) => {
  const posts: blogPost[] = await getPosts()
  return json({ posts });
};

function Post({ blogPost }: { blogPost: any }) {
  const { title, date, content, category } = blogPost;
  const dateObj = new Date(date)
  const displayDate = new Intl.DateTimeFormat('en-US', { month: "long", day: "2-digit", year: "numeric" }).format(dateObj);
  function trimContent(content: string) {
    return content.slice(0, 200) + "...";
  }

  return (
    <article className={'flex flex-col relative overflow-hidden'}>
      <div className="absolute before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-full before:h-full before:bg-[#ebe7e0] before:dark:bg-[#1e293b] before:opacity-[.85] h-full w-full">
        <img src={blogPost.image} className="h-full w-full object-cover" alt="" />
      </div>
      <div className="px-4 flex flex-col gap-6 py-8">
        <div className="flex gap-4 z-10 font-serif items-center">
          <p className="font-bold">{category}</p>
          <p className="text-lightDark dark:text-slate-300 font-thin">{displayDate}</p>
        </div>
        <div className="flex z-10">
          <Link prefetch="intent" to={`/blog/${blogPost.slug}`}>
            <h1 className="text-3xl font-bold text-dark dark:text-slate-100 underline-offset-2 hover:underline">{title}</h1>
          </Link>
        </div>
        <div className="flex z-10">
          <p>{trimContent(content)}</p>
        </div>
        <div className="flex z-10">
          <Link prefetch="intent" className="text-[#ff8059] font-bold font-serif underline-offset-2 hover:underline" to={`/blog/${blogPost.slug}`}>Read More</Link>
        </div>
      </div>
    </article>
  )

}
export default function BlogRoute() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <main className="bg-cream dark:bg-slate-800">
      <h1 className="text-5xl text-dark dark:text-slate-100  py-8 px-4">Blog</h1>
      <section className=" text-dark dark:text-slate-100">
        <p className="px-4 mb-8">Check out some of my writing! I will update weekly</p>
        <div className="grid">
          {posts.map((post) => (
            <Post key={post.id} blogPost={post} />
          ))}
        </div>
      </section>
    </main>
  );
};
