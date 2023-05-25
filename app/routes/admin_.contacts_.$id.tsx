import { LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getContactById } from "~/models/contact.server";
import ContactRoute from "./contact";
import { Link, useLoaderData } from "@remix-run/react";
import { BsArrowLeft } from "react-icons/bs";

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.id
  invariant(slug, "No slug found!")
  const contact = await getContactById(slug)
  invariant(contact, "No contact found!")
  return { contact }
};
export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | View Contact" }
  ]
}


export default function ViewContactRoute() {
  const { contact } = useLoaderData<typeof loader>()
  return (
    <main className="bg-cream px-4 py-8">
      <div className="mb-4 flex">
        <Link className="flex items-center gap-1" to="/admin/contacts"><BsArrowLeft /> Back</Link>
      </div>
      <h1 className="text-5xl font-bold">Contact from {contact.name}</h1>
      <div className="flex flex-col mb-8 mt-2 gap-4">
        <p className="font-serif">Email: {contact.email}</p>
      </div>
      <div className="flex flex-col">
        <p className="font-bold text-3xl">Message</p>
        <p className="text-xl font-serif">{contact.message}</p>
      </div>
    </main>
  );
};