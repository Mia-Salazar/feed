import { cacheLife } from "next/cache";
import { loadPost, loadPosts } from "../api/posts";

export async function loadCachedPosts(skip: number) {
  "use cache";
  cacheLife("minutes");

  return loadPosts(skip);
}

export async function loadCachedPost(id: number) {
  "use cache";
  cacheLife("minutes");

  return loadPost(id);
}
