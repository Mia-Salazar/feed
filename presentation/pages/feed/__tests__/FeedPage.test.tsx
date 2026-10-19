import { store } from "@/store/store";
import { jsonResponse } from "@/tests/jsonResponse";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { FeedPage } from "../FeedPage";
import { clearPosts } from "@/store/postsSlice";
import { RestoreFeedScroll } from "../components/RestoreFeedScroll";

let mockPathname = "/";

const pageHeight = 2000;
const screenHeight = 800;

function setPageScroll(scrollY: number) {
  Object.defineProperty(window, "innerHeight", { configurable: true, value: screenHeight });
  Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: pageHeight,
  });
}

function reachTheBottom() {
  setPageScroll(pageHeight);
  window.dispatchEvent(new Event("scroll"));
}

const freshPost = {
  id: 900,
  title: "Fresh story",
  body: "It just arrived",
  author: { name: "Grace Hopper", avatarUrl: "" },
};

let mockDeliverPost: (post: typeof freshPost) => void = () => {};

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

jest.mock("@/api/livePosts", () => ({
  subscribeToNewPosts: (onPost: (post: typeof freshPost) => void) => {
    mockDeliverPost = onPost;
    return () => {};
  },
}));

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

const author = {
  id: 3,
  firstName: "Ada",
  lastName: "Lovelace",
  image: "https://dummyjson.com/icon/ada/128",
};

function post(id: number, title: string, body = "Text of the post") {
  return { id, title, body, userId: 3 };
}

function mockFeed(pages: { skip: number; posts: ReturnType<typeof post>[]; total: number }[]) {
  fetchMock.mockImplementation((input) => {
    const url = String(input);
    const page = pages.find(
      (item) => url === `https://dummyjson.com/posts?limit=20&skip=${item.skip}`,
    );

    if (page) {
      return Promise.resolve(jsonResponse({ posts: page.posts, total: page.total }));
    }

    if (url === "https://dummyjson.com/users?limit=0") {
      return Promise.resolve(jsonResponse({ users: [author] }));
    }

    return Promise.reject(new Error(url));
  });
}

function openHome() {
  render(
    <Provider store={store}>
      <FeedPage />
    </Provider>,
  );
}

beforeEach(() => {
  store.dispatch(clearPosts());
  mockPathname = "/";
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

describe("Given DummyJSON returns one publication", () => {
  beforeEach(() => {
    mockFeed([{ skip: 0, posts: [post(7, "Story")], total: 1 }]);
  });

  describe("When they open the home page", () => {
    it("Then they see that the posts are loading", async () => {
      openHome();

      expect(screen.getByText("Loading posts…")).toBeVisible();

      await screen.findByRole("link", { name: "Story" });
      expect(screen.queryByText("Loading posts…")).not.toBeInTheDocument();
    });

    it("Then they see the author and the text", async () => {
      openHome();

      expect(await screen.findByRole("link", { name: "Story" })).toHaveAttribute("href", "/posts/7");
      expect(screen.getByText("Ada Lovelace")).toBeVisible();
      expect(screen.getByText("Text of the post")).toBeVisible();
    });
  });
});

describe("Given they are partway down the feed", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("When they open a post and come back", () => {
    it("Then the feed is where they left it", async () => {
      const user = userEvent.setup();
      setPageScroll(480);
      jest.spyOn(window, "scrollTo").mockImplementation(() => undefined);
      mockFeed([{ skip: 0, posts: [post(7, "Story")], total: 1 }]);
      const view = render(
        <Provider store={store}>
          <RestoreFeedScroll />
          <FeedPage />
        </Provider>,
      );
      await user.click(await screen.findByRole("link", { name: "Story" }));
      mockPathname = "/posts/7";
      view.rerender(
        <Provider store={store}>
          <RestoreFeedScroll />
          <FeedPage />
        </Provider>,
      );

      mockPathname = "/";
      view.rerender(
        <Provider store={store}>
          <RestoreFeedScroll />
          <FeedPage />
        </Provider>,
      );

      expect(window.scrollTo).toHaveBeenCalledWith(0, 480);
    });
  });
});

describe("Given there is another page of posts", () => {
  beforeEach(() => {
    mockFeed([
      {
        skip: 0,
        posts: Array.from({ length: 20 }, (_, index) => post(index + 1, `Story ${index + 1}`)),
        total: 21,
      },
      { skip: 20, posts: [post(21, "Story 21")], total: 21 },
    ]);
    setPageScroll(0);
  });

  describe("When they scroll to the bottom of the list", () => {
    it("Then the next posts appear", async () => {
      openHome();
      await screen.findByRole("link", { name: "Story 20" });
      expect(screen.queryByRole("link", { name: "Story 21" })).not.toBeInTheDocument();

      await act(async () => {
        reachTheBottom();
      });

      expect(await screen.findByRole("link", { name: "Story 21" })).toBeVisible();
    });
  });
});

describe("Given a post body is longer than the preview", () => {
  const shown = "The full story continues past the preview. The full story continues past the preview. The full story";
  const body = `${shown} keeps going on the post page.`;

  beforeEach(() => {
    mockFeed([{ skip: 0, posts: [post(7, "Story", body)], total: 1 }]);
  });

  describe("When they open the home page", () => {
    it("Then they see the start of the text and an ellipsis", async () => {
      openHome();

      expect(await screen.findByText(`${shown}…`)).toBeVisible();
      expect(screen.queryByText(/keeps going on the post page/)).not.toBeInTheDocument();
    });
  });
});

describe("Given they are reading the feed", () => {
  beforeEach(() => {
    mockFeed([{ skip: 0, posts: [post(7, "Story")], total: 1 }]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("When a new post is pushed", () => {
    it("Then they see it first, marked as new", async () => {
      openHome();
      await screen.findByRole("link", { name: "Story" });

      await act(async () => {
        mockDeliverPost(freshPost);
      });

      expect(screen.getAllByRole("heading", { level: 2 })[0]).toHaveAccessibleName("Fresh story");
      expect(screen.getByText("New")).toBeVisible();
    });

    it("And the new mark goes away after a few seconds", async () => {
      jest.useFakeTimers();
      openHome();
      await screen.findByRole("link", { name: "Story" });
      await act(async () => {
        mockDeliverPost(freshPost);
      });

      await act(async () => {
        jest.advanceTimersByTime(4000);
      });

      expect(screen.getByRole("heading", { name: "Fresh story" })).toBeVisible();
      expect(screen.queryByText("New")).not.toBeInTheDocument();
    });
  });
});

describe("Given the posts request fails", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));
  });

  describe("When they open the home page", () => {
    it("Then they are told the posts could not be loaded", async () => {
      openHome();

      expect(await screen.findByText("Could not load the posts (500).")).toBeVisible();
    });
  });
});
