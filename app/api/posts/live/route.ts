const encoder = new TextEncoder();
const pushDelay = 1500;

export function GET() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      // A comment frame flushes the stream so the browser keeps it open.
      controller.enqueue(encoder.encode(": connected\n\n"));
      timer = setTimeout(() => {
        const post = {
          id: Date.now(),
          title: "A new post just arrived",
          body: "This post was pushed while you were reading the feed.",
          author: { name: "Live update", avatarUrl: "" },
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(post)}\n\n`));
      }, pushDelay);
    },
    cancel() {
      clearTimeout(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
