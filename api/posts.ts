import { Post } from "../domains/posts";

const postsUrl = "https://dummyjson.com/posts";
const usersUrl = "https://dummyjson.com/users";

const postsPerPage = 20;

interface RawPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface RawUser {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
}

// Later pages reuse this. A failed request is dropped so the next one can try again.
let authorsRequest: Promise<ReadonlyMap<number, RawUser>> | undefined;

function loadAuthors() {
  authorsRequest ??= fetch(`${usersUrl}?limit=0`) // Every user, so each post can take its author.
    .then((response) => readJson(response, "Could not load the authors"))
    .then(mapUsers)
    .catch((caught: unknown) => {
      authorsRequest = undefined;
      throw caught;
    });

  return authorsRequest;
}

export async function loadPosts(skip = 0): Promise<{ posts: readonly Post[]; total: number }> {
  const [postsResponse, users] = await Promise.all([
    fetch(`${postsUrl}?limit=${postsPerPage}&skip=${skip}`),
    loadAuthors(),
  ]);
  const page = mapPosts(await readJson(postsResponse, "Could not load the posts"));

  return {
    posts: page.posts.map((post) => toPost(post, users.get(post.userId))),
    total: page.total,
  };
}

export async function loadPost(id: number): Promise<Post | null> {
  const response = await fetch(`${postsUrl}/${id}`);

  if (response.status === 404) {
    return null;
  }

  const data = await readJson(response, "Could not load the post");

  if (!isRawPost(data)) {
    throw new Error("The post does not have the expected shape.");
  }

  const users = await loadAuthors();

  return toPost(data, users.get(data.userId));
}

async function readJson(response: Response, error: string): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`${error} (${response.status}).`);
  }

  return response.json();
}

function mapPosts(data: unknown): { posts: readonly RawPost[]; total: number } {
  if (!isRecord(data) || !Array.isArray(data.posts)) {
    throw new Error("The posts response does not have the expected shape.");
  }

  const posts = data.posts.map((post) => {
    if (!isRawPost(post)) {
      throw new Error("A post in the response does not have the expected shape.");
    }

    return post;
  });

  return {
    posts,
    total: typeof data.total === "number" ? data.total : posts.length,
  };
}

function mapUsers(data: unknown): ReadonlyMap<number, RawUser> {
  if (!isRecord(data) || !Array.isArray(data.users)) {
    throw new Error("The authors response does not have the expected shape.");
  }

  const users = new Map<number, RawUser>();

  for (const user of data.users) {
    if (isRawUser(user)) {
      users.set(user.id, user);
    }
  }

  return users;
}

function toPost(post: RawPost, user: RawUser | undefined): Post {
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    author: user
      ? { name: `${user.firstName} ${user.lastName}`, avatarUrl: user.image }
      : { name: `User ${post.userId}`, avatarUrl: "" },
  };
}

function isRawPost(value: unknown): value is RawPost {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.body === "string" &&
    typeof value.userId === "number"
  );
}

function isRawUser(value: unknown): value is RawUser {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.firstName === "string" &&
    typeof value.lastName === "string" &&
    typeof value.image === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
