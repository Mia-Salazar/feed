import Link from "next/link";
import { Post } from "../../domains/posts";
import { Author } from "./Author";


const previewLength = 100;

function preview(body: string) {
  if (body.length <= previewLength) {
    return body;
  }

  return `${body.slice(0, previewLength).trimEnd()}…`;
}

export function PostSummary({
  post,
  highlighted = false,
  onOpen,
}: {
  post: Post;
  highlighted?: boolean;
  onOpen: () => void;
}) {
  return (
    <article aria-labelledby={`publication-${post.id}`}>
      <div className="grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-3">
        <Author
          avatarUrl={post.author.avatarUrl}
          name={post.author.name}
          nameClassName="self-center text-sm font-semibold"
          size={40}
        />
        <div
          className={`relative col-start-2 border p-4 ${highlighted ? "border-accent bg-accent/30" : "border-foreground/15 bg-white"}`}
        >
          {highlighted ? <p className="mb-2 text-xs font-semibold">New</p> : null}
          <h2 className="text-base font-semibold leading-6" id={`publication-${post.id}`}>
            <Link
              className="underline-offset-4 after:absolute after:inset-0 hover:underline"
              href={`/posts/${post.id}`}
              onClick={onOpen}
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">{preview(post.body)}</p>
        </div>
      </div>
    </article>
  );
}
