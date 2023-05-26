import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getProjectBySlug } from "~/models/project.server";
import { Parallax } from "react-parallax";
import draftCSS from "quill/dist/quill.snow.css";


export const links = () => [{ rel: "stylesheet", href: draftCSS }];

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  if (!slug) throw new Error("No slug found. Please enter a slug!")
  const project = await getProjectBySlug(slug)
  return json({ project });
};

export default function SingleProjectRoute() {
  const { project } = useLoaderData<typeof loader>();
  const dateObj = new Date(project.date);
  const displayYear = dateObj.getFullYear();
  return (
    <main>
      <h1 className="text-5xl text-dark bg-cream dark:bg-slate-800 py-8 px-4">{project.title}</h1>
      <section className="bg-cream dark:bg-slate-800 text-dark dark:text-slate-100 font-serif px-4">
        <div className="flex flex-col gap-10">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <p className="text-lightDark dark:text-slate-100 font-thin">Year</p>
              <span className="font-bold text-dark dark:text-slate-100 leading-6">{displayYear}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lightDark font-thin">Categories</p>
            <span className="font-bold text-dark leading-6">{project.type}</span>
          </div>
        </div>
      </section>
      <div className="py-10 bg-cream dark:bg-slate-800">
        <Parallax
          bgImage={project.image}
          strength={100}
          className="h-[300px] w-full md:h-[500px] lg:h-[900px]"
        >
        </Parallax>
      </div>

      <section className="bg-cream px-4 dark:bg-slate-800 pb-8">
        <h1 className="font-bold text-2xl">Project Details</h1>
        <div className="mt-8">
          <div dangerouslySetInnerHTML={{ __html: project.content }} className="font-thin text-lightDark font-serif">
          </div>
        </div>
        <div className="grid gap-8 py-8 md:grid-cols-3">
          {project.photos.map((photo, index) => (
            <div key={index}>
              <img src={photo.image} alt="" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
