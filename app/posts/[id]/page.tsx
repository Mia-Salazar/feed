import { Suspense } from "react";
import { loadPost } from "@/api/posts";
import { LoadingPost } from "@/presentation/pages/post/components/LoadingPost";
import { PostPage } from "@/presentation/pages/post/PostPage";


export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
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
    Number.isInteger(numericId) && numericId > 0 ? await loadPost(numericId) : null;

  return <PostPage key={id} id={id} initialPost={initialPost} />;
}


