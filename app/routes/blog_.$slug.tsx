import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { blogPost } from "~/models/blog.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const post: blogPost = {
    id: "1",
    slug: "single-post",
    title: "Exercise Regularly",
    date: new Date(),
    content: "It may seem counterintuitive, but regular exercise can actually boost your energy levels and enhance productivity. When you engage in physical activities, your body releases neurotransmitters that increase alertness and mental clarity. Regular exercise improves blood circulation, delivering oxygen and nutrients to the brain and other vital organs. This results in improved cognitive function and increased productivity. Furthermore, exercise promotes better sleep quality, which ensures you wake up refreshed and ready to tackle the day's tasks with increased efficiency.",
    category: "Remix Run",
    image: `https://picsum.photos/id/237/700/700`
  }
  return json({ post });
};
export default function BlogSlugRoute() {
  const { post } = useLoaderData<typeof loader>();
  const dateObj = new Date(post.date)
  const displayDate = new Intl.DateTimeFormat('en-US', { month: "long", day: "2-digit", year: "numeric" }).format(dateObj);
  return (
    <main>
      <section className="flex flex-col gap-4 px-4">
        <h1 className="text-5xl text-dark mt-12 mb-4">{post.title}</h1>
        <span className="flex gap-1 font-serif">
          <span className="font-bold text-[#ff8059]">{post.category}</span>
          /
          <span className="text-lightDark font-thin">{displayDate}</span>
        </span>
      </section>
      <div className="mt-8 px-4">
        <div className="flex">
          <img src={post.image} alt="" />
        </div>
        <div className="flex my-6">
          <p>{post.content}</p>
        </div>
      </div>
    </main>

  );
};