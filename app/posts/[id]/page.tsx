import { Suspense } from "react";
import { LoadingPost, PostPage } from "../../../presentation/pages/post/PostPage";
import { loadCachedPost } from "../../cachedPosts";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingPost />}>
      <PostRoute params={params} />
    </Suspense>
  );
}

async function PostRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const initialPost =
    Number.isInteger(numericId) && numericId > 0 ? await loadCachedPost(numericId) : null;

  return <PostPage id={id} initialPost={initialPost} />;
}
