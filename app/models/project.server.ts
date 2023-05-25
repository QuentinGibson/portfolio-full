import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export interface Project {
  id: string;
  slug: string;
  title: string;
  date: Date;
  content: string;
  category: string;
  image: string;
  type: string;
  link: string;
  gallery: string[];
}

export async function createProject(formData: any) {
  const projectData = formData
  const galleryData = formData.photos.map((photoUrl : any) => {
    return {image: photoUrl}
  }) 
  projectData.photos = { create: [ ...galleryData ] }
  const project = await prisma.project.create({data: projectData})
  invariant(project, "Create project failed")
  return project
}

export async function getProjects() {
  const projects = await prisma.project.findMany()
  return projects
}

export async function getProjectBySlug(slug:string) {
  const project = await prisma.project.findUnique({ where: { slug }, include: {photos: true} })
  if (!project) {
    throw new Error("Project not found")
  }
  return project
}