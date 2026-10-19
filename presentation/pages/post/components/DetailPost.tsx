import Link from "next/link";

import { Author } from "../../../molecules/Author";
import { Post } from "../../../../domains/posts";


export function DetailPost({ post }: { post: Post }) {
  return (
    <article className="border border-foreground/15 bg-white p-4 sm:p-6">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        href="/"
        scroll={false}
      >
        <span aria-hidden="true">‹</span>
        Back to the feed
      </Link>
      <div className="mt-6 flex flex-col items-center">
        <Author
          avatarUrl={post.author.avatarUrl}
          name={post.author.name}
          nameClassName="mt-3 text-lg font-semibold"
          size={96}
        />
      </div>
      <div className="mt-6 border border-foreground/15 p-4 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-3 text-base leading-7">{post.body}</p>
      </div>
    </article>
  );
}
