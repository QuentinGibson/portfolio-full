import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getProjects } from "~/models/project.server";

interface Project {
  id: string;
  title: string;
  type: string;
  image: string;
  content: string
  link: string;
  slug: string;
}

interface Photo {
  id: string
  image: string
}


export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Projects" }
  ]
}

function Work({ project }: { project: Project }) {
  return (
    <article className="px-4">
      <Link prefetch="intent" to={`/projects/${project.slug}`}>
        <div className="flex flex-col gap-6 text-dark dark:text-slate-100 justify-center items-center md:grid md:grid-cols-2">
          <div className="flex">
            <img className="w-full" src={project.image} alt="" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-4xl">{project.title}</h2>
            <div className="font-serif font-thin text-lightDark dark:text-slate-300 flex flex-col mt-4">
              <p>{project.type}</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}


export const loader = async ({ request, params }: LoaderArgs) => {
  const projects: Project[] = await getProjects()
  return json({ projects });
};

export default function ProjectsRoute() {
  const { projects } = useLoaderData<typeof loader>();
  return (
    <main className="bg-cream dark:bg-slate-800 my-8">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-5xl text-dark dark:text-slate-100 py-8 px-4">Projects</h1>
        <section className=" text-dark dark:text-slate-100">
          <p className="px-4 mb-8"> A Collection of my favorites project I’ve designed recently. Featured Projects. </p>
          <div className="grid gap-8">
            {projects.map((project) => (
              <Work key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
