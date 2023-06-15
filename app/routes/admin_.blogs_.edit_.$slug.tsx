import { DataFunctionArgs, LoaderArgs } from "@remix-run/node";
import {requireUser, getSession} from '~/session.server'
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import draftCSS from "quill/dist/quill.snow.css";
import invariant from "tiny-invariant";
import { getPostBySlug, updatePost } from "~/models/blog.server";
import { getCurrentDateInput } from "~/utils";

export const links = () => [{ rel: "stylesheet", href: draftCSS }];

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Edit Blog" }
  ]
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug
  invariant(slug, "No slug found")
  const post = await getPostBySlug(slug)
  return { post }
};

export default function AdminEditPost() {
  const { post } = useLoaderData<typeof loader>()
  const { quill, quillRef } = useQuill();
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    quill?.on('text-change', () => {
      setContent(quill?.root.innerHTML)
    })
  }, [quill])

  useEffect(() => {
    quill?.clipboard.dangerouslyPasteHTML(0, post.content);

  }, [quill])

  return (
    <main className="bg-cream py-8 px-4">
      <h1 className="text-5xl font-bold">Edit Blog - {post.title}</h1>
      <Form method="POST" className="mt-8" encType="multipart/form-data">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="title">Title</label>
            <input type="text" name="title" id="title" defaultValue={post.title} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="slug">Slug</label>
            <input type="text" name="slug" id="slug" defaultValue={post.slug} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="date">Date</label>
            <input type="date" name="date" id="date" defaultValue={getCurrentDateInput(post.date)} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="category">Category</label>
            <input type="text" name="category" id="category" defaultValue={post.category} />
          </div>
          <div className="flex gap-2">
            <label className="text-lg" htmlFor="image">Image</label>
            <input type="file" name="image" id="image" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="content" className="text-lg">Content</label>
            <div className="mt-2 mb-8">
              <div className="w-full h-[500px] bg-slate-300">
                <div ref={quillRef} className="bg-white"></div>
                <input type="hidden" name="content" value={content} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-yellow-700" type="submit">Submit</button>
            <input type="hidden" value={post.id} name="id" />
          </div>
        </div>
      </Form>
    </main>
  );
};

export const action = async ({ request, params }: DataFunctionArgs) => {
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
  const id = formData.get("id") as string;

  const url = image.filepath.slice(publicIndex)
  if (photos) {
    const galleryList = photos.map(photo => photo.filepath.slice(publicIndex))
  }

  await updatePost(id, {
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