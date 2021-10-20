/**
 * @jest-environment jsdom
 */
import { ArticleMeta } from "../../src/components/ArticleMeta";
import {
  makeTestParentFixture,
  makeTestFixture,
  makeStore,
  makeEnvironment,
  nextTick,
  click,
} from "../helpers";
import { mount } from "@odoo/owl";
let fixture;
let store;
let env;
let parentFixture;

const eventHandler = jest.fn();

beforeEach(async () => {
  parentFixture = makeTestParentFixture();
  fixture = makeTestFixture(parentFixture);
  store = makeStore();
  env = await makeEnvironment(store);
  ArticleMeta.env = env;
});

afterEach(() => {
  fixture.remove();
});

describe("ArticleMeta", () => {
  test("ArticleMeta is instantiated as expected...", async () => {
    const props = {
      articlesListMode: true,
      article: {
        title: "Sad backend",
        slug: "Sad-backend",
        body: "# Hello world\n\nWhat is happening with the backend API ? :(",
        description: "Nothing",
        createdAt: "2021-10-19T09:54:36.484Z",
        updatedAt: "2021-10-19T09:54:36.484Z",
        tagList: [],
        favoritesCount: 3,
        favorited: true,
        author: {
          username: "Philippe",
          bio: null,
          image:
            "https://realworld-temp-api.herokuapp.com/images/smiley-cyrus.jpeg",
        },
      },
    };
    const articleResponse = {
      title: "Sad backend",
      slug: "Sad-backend",
      body: "# Hello world\n\nWhat is happening with the backend API ? :(",
      description: "Nothing",
      createdAt: "2021-10-19T09:54:36.484Z",
      updatedAt: "2021-10-19T09:54:36.484Z",
      tagList: [],
      favoritesCount: 2,
      favorited: false,
      author: {
        username: "Philippe",
        bio: null,
        image:
          "https://realworld-temp-api.herokuapp.com/images/smiley-cyrus.jpeg",
      },
    };
    fetch.mockResponseOnce(
      JSON.stringify({
        article: articleResponse,
      })
    );

    const comp = await mount(ArticleMeta, { target: fixture, props });
    parentFixture.addEventListener("update-favorited", eventHandler);
    expect(fixture.innerHTML).toContain("Philippe");
    expect(fixture.innerHTML).toContain('<i class="ion-heart"></i> 3');
    await fixture.querySelector("button").click();
    await nextTick();
    expect(eventHandler).toHaveBeenCalled();
    const detail = eventHandler.mock.calls[0][0].detail;
    expect(detail.article.favoritesCount).toBe(2);
    expect(detail.article.favorited).toBe(false);
    Object.assign(props, { article: detail.article });
    await comp.render();
    await nextTick();
    expect(fixture.innerHTML).toContain('<i class="ion-heart"></i> 2');
  });
});
