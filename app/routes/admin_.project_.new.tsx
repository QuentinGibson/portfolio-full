import { Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";

import draftCSS from "quill/dist/quill.snow.css";
import { getSession, requireUser, sessionStorage } from "~/session.server";
import { DataFunctionArgs, LoaderArgs, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createProject } from "~/models/project.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = requireUser(request)
  return {}
};

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | New Project" }
  ]
}

export const links = () => [{ rel: "stylesheet", href: draftCSS }];

export default function NewProjectRoute() {
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    quill?.on('text-change', () => {
      setContent(quill?.root.innerHTML)
    })
  }, [quill])
  return (
    <main className="bg-cream px-4 py-8">
      <h1 className="font-bold text-5xl mb-8">New Project</h1>
      <Form method="POST" encType="multipart/form-data">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="title">Title</label>
            <input required type="text" name="title" id="title" />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="slug">Slug</label>
            <input required type="text" name="slug" id="slug" />
          </div><div className="flex gap-2">
            <label className="text-lg" htmlFor="link">Link</label>
            <input required type="text" name="link" id="link" />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="date">Date</label>
            <input required type="date" name="date" id="date" />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="type">Type</label>
            <input required type="text" name="type" id="type" />
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

export const action = async ({ request, params }: DataFunctionArgs) => {
  const user = await requireUser(request)
  const session = await getSession(request);
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      directory: "./public/uploads/project",
      avoidFileConflicts: true,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const image = formData.get("image") as any
  const photos = formData.getAll("photos") as any[]
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const date = formData.get("date") as string;
  const dateObj = new Date(date)
  const content = formData.get("content") as string;
  const publicIndex = image.filepath.indexOf("uploads") - 1
  const link = formData.get("link") as string;
  const type = formData.get("type") as string;

  const url = image.filepath.slice(publicIndex)
  const galleryList = photos.map(photo => photo.filepath.slice(publicIndex))

  invariant(image, "Image is required")
  invariant(title, "Title is required")
  invariant(slug, "Slug is required")
  invariant(content, "Content is required")

  invariant(image.filepath.includes("/uploads"), "Image must be uploaded")
  invariant(title.length > 0, "Title must be longer than 0")
  invariant(slug.length > 0, "Slug must be longer than 0")
  invariant(content.length > 0, "Content must be longer than 0")

  invariant(url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".jfif") || url.endsWith("webp"), "Image must be a png, jpg, or jpeg")
  invariant(slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), "Slug must be a valid slug")
  invariant(title.length < 100, "Title must be less than 100 characters")
  invariant(content.length > 100, "Content must be more than 100 characters")

  await createProject({
    image: url,
    title,
    slug,
    content,
    date: dateObj,
    type,
    link,
    photos: galleryList
  })

  session.flash("globalMessage", "Post created sucessfully!")
  return redirect("/projects", { headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
};