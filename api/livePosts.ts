import { Post } from "../domains/posts";

export function subscribeToNewPosts(onPost: (post: Post) => void) {
  if (typeof EventSource === "undefined") {
    return () => {};
  }

  const source = new EventSource("/api/posts/live");

  source.onmessage = (event: MessageEvent) => {
    const post = asPost(parseJson(String(event.data)));

    if (post) {
      onPost(post);
    }
  };

  return () => source.close();
}

function parseJson(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function asPost(value: unknown): Post | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const post = value as Post;

  if (
    typeof post.id !== "number" ||
    typeof post.title !== "string" ||
    typeof post.body !== "string" ||
    typeof post.author?.name !== "string" ||
    typeof post.author?.avatarUrl !== "string"
  ) {
    return null;
  }

  return post;
}
