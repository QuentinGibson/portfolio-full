import { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/blog.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const posts = await getPosts();
  // throw new Error("No posts found")
  return { posts }
};

export default function AdminBlogRoute() {
  const { posts } = useLoaderData<typeof loader>()
  return (
    <main className="px-4 py-8 bg-cream">
      <h1 className="font-bold text-5xl mb-8">Blog Posts</h1>
      <div>
        <ul>
          {posts.map(post =>
            <li>
              <div className="flex gap-2 items-center">
                <Link className="hover:underline" to={`/blog/${post.slug}`}>{post.title} </Link>
                <Link className="px-2 py-1 bg-blue-500" to={`edit/${post.slug}`}>Edit</Link>
                <Form>
                  <button className="px-2 py-1 bg-red-500">Delete</button>
                </Form>
              </div>
            </li>)}
        </ul>
      </div>
    </main>
  );
};
