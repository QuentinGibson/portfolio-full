import { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getContacts } from "~/models/contact.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const contacts = await getContacts()
  return { contacts }
};

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | All Contacts" }
  ]
}

export default function ContactRoute() {
  const { contacts } = useLoaderData<typeof loader>()
  return (
    <main className="bg-cream px-4 py-8">
      <h1 className="text-5xl mb-8 font-bold">Contacts</h1>
      <ul>
        {contacts.map((contact, index) =>
          <li>
            <div className="flex gap-1">
              <p className="font-bold">{index + 1} - {contact.name}</p>
              <Link className="hover:underline" to={`/admin/contacts/${contact.id}`}>View Contact</Link>
            </div>
          </li>
        )}
      </ul>
    </main>
  );
};