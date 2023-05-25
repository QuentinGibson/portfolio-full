import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export interface blogPost {
  id: string;
  slug: string;
  title: string;
  date: Date;
  content: string;
  category: string;
  image: string;
}

export async function createBlog(postData: any) {
  const post = await prisma.post.create({data: postData})
  return post
}

export async function getPostBySlug(slug:string) {
  const post = await prisma.post.findUnique({where: {slug}})
  invariant(post, "No post found")
  return post
}

export async function getPosts() {
  const posts = await prisma.post.findMany()
  if (!posts) {
    throw new Error("No posts found")
  }
  return posts
}