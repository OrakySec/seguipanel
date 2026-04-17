export const dynamic = "force-dynamic";

import { getBlogs } from "./actions";
import BlogClient from "./BlogClient";

export default async function AdminBlogPage() {
  const posts = await getBlogs();
  const serialized = posts.map((p: any) => ({
    ...p,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  return <BlogClient initialPosts={serialized} />;
}
