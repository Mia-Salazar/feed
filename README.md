# Feed Project

## Run

The same commands work on Windows, macOS, and Linux. Run each one on its own line. Do not join them with `&&`: Windows PowerShell rejects that.

1. Install [Node.js 20.9 or newer](https://nodejs.org) (the current LTS is fine). This includes Corepack.
2. In the project folder, enable the package manager pinned in `package.json` (`pnpm@12.11.2`):

```bash
corepack enable
corepack prepare pnpm@12.11.2 --activate
```

3. Install dependencies and start the app:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

`pnpm test` runs the suite. `pnpm lint` checks the code and the layer boundaries. `pnpm typecheck` checks the types. `pnpm build` then `pnpm start` serves the production build.

## Tests

Tests follow what a person does on the page, and only the main journeys and the important edge cases. A precondition is `describe("Given ...")`, the action is `describe("When ...")`, and the result is `it("Then ...")`. Each test body is Arrange, then Act, then Assert, in that order and without labels. Arrange only prepares. Act only triggers the behavior. Assert only checks the result.

## Technologies

| Piece | Version | Role |
| --- | --- | --- |
| pnpm | 12.11.2 | Package manager |
| Next.js | 16.4.1 | App Router |
| React | 19.3.0 | Interface |
| TypeScript | 5 | Strict typing |
| Tailwind CSS | 4 | Styles. Chosen because it is fast to build an interface. Tokens live in `src/app/globals.css` |
| Redux Toolkit | 2.13 | Global state: the loaded posts and the feed scroll position |
| React Redux | 9.3 | `Provider` |
| Jest | 30 | Tests, with `next/jest` |
| Testing Library | React 16, user-event 14, jest-dom 7 | Tests follow a person using the page |
| ESLint | 9, `eslint-config-next` 16.4.1 | Lint, accessibility, and layer boundaries |

## Structure

```text
src/
  domain/         Post and author. No React, Next, or fetch.
  api/            DummyJSON requests and the live subscription. They return domain posts.
  store/          Redux slice, store, and provider.
  presentation/   Atomic design. One folder per page, with that page's own components.
  app/            Next.js routes, layout, and global styles.
  test/           The small JSON response the tests use. Jest has no Response.
```

## Names

Variables are camelCase. Components and types are UpperCamelCase (`Header`, `Post`). A page always ends in `Page` (`FeedPage`, `PostPage`), so it is not confused with a piece of that screen (`PostList`, `PostSummary`). Files use the same form (`Header.tsx`, `FeedPage.tsx`, `posts.ts`). Route files stay as Next.js requires (`page.tsx`, `route.ts`, `posts/[id]/page.tsx`).

## Pages

| Route | Next.js file | What it renders |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | `Feed` |
| `/posts/[id]` | `src/app/posts/[id]/page.tsx` | `PostScreen` |
| `/api/posts/live` | `src/app/api/posts/live/route.ts` | The live channel. It is not a screen |

## Atomic design

| Level | Components |
| --- | --- |
| Atom | `Avatar`, `HomeLink`, `SkipLink`, `PageContainer` |
| Molecule | `Author` |
| Organism | `Header` |
| Page | `Feed` and `PostPage` |

## Decisions

- **Feed.** Twenty posts per page. Reaching the bottom loads the next page. The skip counts posts fetched from DummyJSON.
- **Live post.** The browser subscribes to `/api/posts/live`. The new post is prepended and marked "New" for 4 seconds.
- **Server data.** The home page and the detail load inside `Suspense` and pass what they received, so the first paint does not fetch it again on the client.
- **Performance.** The logo is requested immediately at 56px, in AVIF or WebP. Avatars load as they approach, each at its own size. The font uses `swap`. The feed and the detail are separate routes. Scroll listening is passive. The live channel is not cached.
- **SOLID.** The domain describes a post. The API owns the DummyJSON call and returns that post. Screens do not know the response shape.
- **DRY.** A fact or a rule lives in one place.
- **KISS.** The smallest solution that meets the case.
- **YAGNI.** Nothing is added until a screen needs it.

## Accessibility

The interface is in English (`lang="en"`). The header is a banner with a navigation named "Main", a skip link that appears on Tab, and one `h1` per page. Avatars are decorative. Loading uses `role="status"` and a failed request uses `role="alert"`. Focus is visible, menu targets are at least 44px, and `prefers-reduced-motion` disables motion. Colors are the ESL FACEIT Group black, white, cream, secondary text, and green, in `src/app/globals.css`.
