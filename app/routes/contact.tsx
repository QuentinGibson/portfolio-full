import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { HiAtSymbol } from 'react-icons/hi'
import invariant from "tiny-invariant";
import { createContact } from "~/models/contact.server";
import { getSession, sessionStorage } from "~/session.server";

export function meta({ matches }: { matches: any }) {
  const rootMeta = matches[0].meta;
  const title = rootMeta.find((m: any) => m.title)
  return [
    { title: title.title + " | Contact" }
  ]
}

export default function ContactRoute() {
  const contactFetcher = useFetcher();
  return (
    <main className="bg-cream">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-5xl text-dark  py-8 px-4">Contact</h1>
        <div className="flex flex-col  font-serif py-8">
          <div className="flex flex-col px-4">
            <Link to="mailto:quentingibson94@gmail.com">
              <HiAtSymbol className="text-4xl text-[#ff8059]" />
              <p className="font-bold text-lg">quentingibson94@gmail.com</p>
            </Link>
          </div>
        </div>
        <section className="">
          <contactFetcher.Form method="POST" className="font-serif">
            <div className="flex flex-col px-4 gap-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="font-bold">Name</label>
                {contactFetcher.data && contactFetcher.data.error.name &&
                  <p className="text-red-500">{contactFetcher.data.error.name}</p>}
                <input type="text" name="name" id="name" placeholder="Enter your name here" className="py-3 px-8 text-lightDark font-thin bg-cream border border-lightDark rounded mt-2" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="font-bold">Email Address</label>
                {contactFetcher.data && contactFetcher.data.error.email &&
                  <p className="text-red-500">{contactFetcher.data.error.email}</p>}
                <input type="email" name="email" id="email" placeholder="Enter your email address" className="py-3 px-8 text-lightDark font-thin bg-cream border border-lightDark rounded mt-2" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="message" className="font-bold">Message</label>
                {contactFetcher.data && contactFetcher.data.error.message &&
                  <p className="text-red-500">{contactFetcher.data.error.message}</p>}
                <textarea name="message" id="message" placeholder="Enter your message here" className="py-3 px-8 text-lightDark font-thin bg-cream border border-lightDark rounded mt-2 resize-y h-48" />
              </div>
              <div className="flex">
                <button type="submit" className="px-6 py-2 border border-[#ff8059] rounded mb-8 hover:bg-[#ff8059]">Submit</button>
              </div>
            </div>
          </contactFetcher.Form>
        </section>

      </div>
    </main>
  );
};

export const action = async ({ request, params }: DataFunctionArgs) => {
  const formData = await request.formData();
  const session = await getSession(request);
  const { message, name, email } = Object.fromEntries(formData.entries());

  try {
    invariant(message.length > 5, "Message is invalid please leave a message thats at least 5 characters long");
  } catch (error: any) {
    return json({ error: { message: "Message is invalid please leave a message thats at least 5 characters long" } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }
  if (typeof message !== "string") {
    return json({ error: { message: "Message is invalid" } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }
  try {
    invariant(message, "Message is required");
  } catch (error: any) {
    return json({ error: { message: "Message is required. Please enter a message" } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }
  try {
    invariant(message.length < 500, "Message is too long");
  } catch (error: any) {
    return json({ error: { message: "Message is too long. Please enter a message less than 500 characters" } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  try {
    invariant(typeof name === "string", "Name is invalid");
  } catch (error: any) {
    return json({ error: { name: "Name is invalid. Please enter a valid name." } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  try {
    invariant(typeof email === "string", "Email is invalid");
    invariant(email.includes("@"), "Email is invalid");
  } catch (error: any) {
    return json({ error: { email: "Email is invalid. Please enter a valid email." } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  try {
    invariant(name, "Name is required");
  } catch (error: any) {
    return json({ error: { name: "Name is required." } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  try {
    invariant(email, "Email is required");
  } catch (error: any) {
    return json({ error: { email: "Email is required." } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  try {
    invariant(name.length < 100, "Name is too long");
  } catch (error: any) {
    return json({ error: { name: "Name is too long. Please enter a name under 100 characters." } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  try {
    invariant(email.length < 100, "Email is too long");
  } catch (error: any) {
    return json({ error: { email: "Email is too long." } }, { status: 400, headers: { "Set-Cookie": await sessionStorage.commitSession(session) } })
  }

  await createContact({ message, name, email })

  session.flash("globalMessage", "Message sent!");

  return redirect("/contact", { headers: { "Set-Cookie": await sessionStorage.commitSession(session) } });
};
