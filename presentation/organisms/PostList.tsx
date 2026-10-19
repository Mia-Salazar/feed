import { Post } from "../../domains/posts";
import { PostSummary } from "../molecules/PostSummary";


export function PostList({
  posts,
  highlightedId,
  onOpen,
}: {
  posts: readonly Post[];
  highlightedId?: number;
  onOpen: () => void;
}) {
  return (
    <ul className="flex list-none flex-col gap-8 p-0">
      {posts.map((post) => (
        <li key={post.id}>
          <PostSummary highlighted={post.id === highlightedId} onOpen={onOpen} post={post} />
        </li>
      ))}
    </ul>
  );
}
