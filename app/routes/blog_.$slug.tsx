import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getPostBySlug } from "~/models/blog.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  invariant(slug, "Please enter a slug!")
  const post = await getPostBySlug(slug)
  return json({ post });
};
export default function BlogSlugRoute() {
  const { post } = useLoaderData<typeof loader>();
  const dateObj = new Date(post.date)
  const displayDate = new Intl.DateTimeFormat('en-US', { month: "long", day: "2-digit", year: "numeric" }).format(dateObj);
  return (
    <main>
      <section className="flex flex-col gap-4 px-4">
        <h1 className="text-5xl text-dark dark:text-slate-100 mt-12 mb-4">{post.title}</h1>
        <span className="flex gap-1 font-serif dark:text-slate-300">
          <span className="font-bold text-[#ff8059]">{post.category}</span>
          /
          <span className="text-lightDark dark:text-slate-300 font-thin">{displayDate}</span>
        </span>
      </section>
      <div className="mt-8 px-4">
        <div className="flex">
          <img src={post.image} alt="" />
        </div>
        <div className="flex my-6">
          <div className="dark:text-slate-100" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
      </div>
    </main>

  );
};