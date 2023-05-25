import { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getProjects } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const projects = await getProjects()
  return { projects }
}

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | All Projects" }
  ]
}


export default function AdminProjects() {
  const { projects } = useLoaderData<typeof loader>()
  return (
    <main className="bg-cream px-4 py-8" >
      <h1 className="mb-8 font-bold text-5xl">Projects</h1>
      <ul>
        {projects.map(project =>
          <li>
            <div className="flex gap-2 items-center">
              <Link className="hover:underline" to={`/projects/${project.slug}`}>{project.title}</Link>
              <Link className="px-4 py-2 bg-blue-500 hover:underline" to={`edit/${project.slug}`}>Edit</Link>
              <Form method="POST" className="flex items-center">
                <button className="px-4 py-2 bg-red-500 hover:underline" type="submit">Delete</button>
              </Form>
            </div>
          </li>
        )}
      </ul>
    </main>
  );
};