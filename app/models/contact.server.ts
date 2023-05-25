import { prisma } from "~/db.server";

export async function createContact(contactData: any) {
  const contact = await prisma.contact.create({data: contactData})
  return contact
}

export async function getContacts() {
  const contacts = await prisma.contact.findMany()
  return contacts
}

export async function getContactById(id: string) {
  const contact = prisma.contact.findUnique({where: {id}}) 
  return contact
}