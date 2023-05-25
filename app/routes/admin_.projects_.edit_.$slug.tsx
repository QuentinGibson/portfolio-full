import { LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProjectBySlug } from "~/models/project.server";
import ProjectsRoute from "./projects";
import { Form, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css";
import { getCurrentDateInput } from "~/utils";

export const links = () => [{ rel: "stylesheet", href: draftCSS }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Project" }
  ]
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  invariant(slug, "Please enter a slug!")
  const project = await getProjectBySlug(slug)
  if (!project) {
    throw new Error("Project not found!")
  }
  return { project }
};
export default function AdminEditProject() {
  const { project } = useLoaderData<typeof loader>()
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    quill?.on('text-change', () => {
      setContent(quill?.root.innerHTML)
    })
  }, [quill])
  useEffect(() => {
    if (content === "") {
      if (quill) {
        quill?.clipboard.dangerouslyPasteHTML(0, project.content);
      }
    }
  }, [quill])
  return (
    <main className="bg-cream px-4 py-8">
      <h1 className="text-5xl mb-8 font-bold">Edit Project - {project.title}</h1>
      <Form method="POST" encType="multipart/form-data">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="title">Title</label>
            <input required type="text" name="title" id="title" defaultValue={project.title} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="slug">Slug</label>
            <input required type="text" name="slug" id="slug" defaultValue={project.slug} />
          </div><div className="flex gap-2">
            <label className="text-lg" htmlFor="link">Link</label>
            <input required type="text" name="link" id="link" defaultValue={project.link} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="date">Date</label>
            <input required type="date" name="date" id="date" defaultValue={getCurrentDateInput(project.date)} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="type">Type</label>
            <input required type="text" name="type" id="type" defaultValue={project.type} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="image">Image</label>
            <input required type="file" name="image" id="image" />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="photos">Photos</label>
            <input required type="file" name="photos" id="photos" multiple />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="content" className="text-lg">Content</label>
            <div className="mt-2 mb-8">
              <div className="w-full h-[500px] bg-slate-300">
                <div ref={quillRef} className="bg-white"></div>
                <input required type="hidden" name="content" value={content} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-yellow-700" type="submit">Submit</button>
          </div>
        </div>
      </Form>
    </main>
  );
};