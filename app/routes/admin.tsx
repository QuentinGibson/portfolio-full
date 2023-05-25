import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { requireUser } from "~/session.server";
import { useUser } from "~/utils";

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Admin" }
  ]
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser(request)
  if (user.role !== "ADMIN") {
    redirect("/")
  }
  return json({})
};

export default function ComponentName() {
  return (
    <main className="bg-cream py-8 px-4">
      <h1 className="text-5xl font-bold pb-8">Admin</h1>
      <ul>
        <li><Link className="hover:underline" to="/admin/new_blog">Create Blog Post</Link></li>
        <li><Link className="hover:underline" to="/admin/blogs">Edit Blog</Link></li>
        <li><Link className="hover:underline" to="/admin/project/new">Create Project</Link></li>
        <li><Link className="hover:underline" to="/admin/projects">Edit Projects</Link></li>
        <li><Link className="hover:underline" to="/admin/contacts">View Contacts</Link></li>
      </ul>
    </main>
  );
};