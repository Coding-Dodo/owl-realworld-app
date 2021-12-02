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
} from "../helpers";
import { mount, QWeb } from "@odoo/owl";
let fixture;
let store;
let env;
let parentFixture;
let updateFavoritedEventHandler;
let updateFollowingEventHandler;
let dummyArticle = {
  title: "CodingDodo Test Article",
  slug: "CodingDodo-Test-Article",
  body: "# Hello world from CodingDodo\n\nThis is the text of the article",
  description: "Description of the Article",
  createdAt: "2021-10-19T09:54:36.484Z",
  updatedAt: "2021-10-19T09:54:36.484Z",
  tagList: [],
  favoritesCount: 5,
  favorited: true,
  author: {
    username: "CodingDodo",
    bio: null,
    image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
    following: false,
  },
};

beforeEach(async () => {
  parentFixture = makeTestParentFixture();
  fixture = makeTestFixture(parentFixture);
  updateFavoritedEventHandler = jest.fn();
  updateFollowingEventHandler = jest.fn();
  parentFixture.addEventListener(
    "update-favorited",
    updateFavoritedEventHandler
  );
  parentFixture.addEventListener(
    "update-following",
    updateFollowingEventHandler
  );
  store = makeStore();
  env = await makeEnvironment(store);
  ArticleMeta.env = env;
});

afterEach(() => {
  QWeb.components = {};
  fixture.remove();
  parentFixture.remove();
  ArticleMeta.env = null;
  store = {};
  env = null;
});

describe("ArticleMeta Component", () => {
  test("ArticleMeta in listMode is instantiated correctly...", async () => {
    const props = {
      articlesListMode: true,
      article: dummyArticle,
    };
    const comp = await mount(ArticleMeta, { target: fixture, props });
    expect(fixture.innerHTML).toContain(
      '<img src="https://api.realworld.io/images/smiley-cyrus.jpeg">'
    );
    expect(fixture.innerHTML).toContain("CodingDodo");
    expect(fixture.innerHTML).toContain(
      '<button name="toggleFavorite" class="btn btn-sm pull-xs-right btn-primary"><i class="ion-heart"></i> 5</button>'
    );
  });

  test("ArticleMeta in Single Article mode is instantiated correctly...", async () => {
    const props = {
      articlesListMode: false,
      article: dummyArticle,
    };
    const comp = await mount(ArticleMeta, { target: fixture, props });
    expect(fixture.innerHTML).toContain(
      '<img src="https://api.realworld.io/images/smiley-cyrus.jpeg">'
    );
    expect(fixture.innerHTML).toContain(
      '<button name="toggleFollow" class="btn btn-sm btn-outline-secondary"><i class="ion-plus-round"></i> Follow CodingDodo</button>'
    );
    expect(fixture.innerHTML).toContain(
      '<button name="toggleFavorite" class="btn btn-sm btn-primary"><i class="ion-heart"></i> Unfavorite Post <span class="counter">(5)</span></button>'
    );
  });

  test("ArticleMeta in listMode toggling favorite correctly...", async () => {
    const props = {
      articlesListMode: true,
      article: dummyArticle,
    };
    fetch.mockResponseOnce(
      JSON.stringify({
        article: { ...dummyArticle, favoritesCount: 4, favorited: false },
      })
    );
    const comp = await mount(ArticleMeta, { target: fixture, props });
    await fixture.querySelector("button[name='toggleFavorite']").click();
    await nextTick();
    expect(updateFavoritedEventHandler).toHaveBeenCalled();
    const detail = updateFavoritedEventHandler.mock.calls[0][0].detail;
    expect(detail.article.favoritesCount).toBe(4);
    expect(detail.article.favorited).toBe(false);
    Object.assign(props, { article: detail.article });
    await comp.render();
    await nextTick();
    expect(fixture.innerHTML).toContain('<i class="ion-heart"></i> 4');
    comp.unmount();
    comp.destroy();
  });

  test("ArticleMeta in Single Article mode toggling favorite as expected...", async () => {
    const props = {
      articlesListMode: false,
      article: dummyArticle,
    };
    fetch.mockResponseOnce(
      JSON.stringify({
        article: {
          ...dummyArticle,
          favoritesCount: 4,
          favorited: false,
        },
      })
    );
    const comp = await mount(ArticleMeta, { target: fixture, props });
    await fixture.querySelector("button[name='toggleFavorite']").click();
    await nextTick();
    expect(updateFavoritedEventHandler).toHaveBeenCalled();
    const detail = updateFavoritedEventHandler.mock.calls[0][0].detail;
    expect(detail.article.favoritesCount).toBe(4);
    expect(detail.article.favorited).toBe(false);
    Object.assign(props, { article: detail.article });
    await comp.render();
    await nextTick();
    expect(fixture.innerHTML).toContain(
      ' Favorite Post <span class="counter">(4)</span>'
    );
  });

  test("ArticleMeta in Single Article mode following user action works as expected...", async () => {
    const props = {
      articlesListMode: false,
      article: dummyArticle,
    };
    fetch.mockResponseOnce(
      JSON.stringify({
        profile: {
          username: "CodingDodo",
          bio: null,
          image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
          following: true,
        },
      })
    );
    const comp = await mount(ArticleMeta, { target: fixture, props });
    await fixture.querySelector("button[name='toggleFollow']").click();
    await nextTick();
    expect(updateFollowingEventHandler).toHaveBeenCalled();
    let detail = updateFollowingEventHandler.mock.calls[0][0].detail;
    expect(detail.profile.following).toBe(true);
    expect(detail.profile.username).toBe("CodingDodo");
    Object.assign(props.article, { author: detail.profile });
    await comp.render();
    await nextTick();
    expect(fixture.innerHTML).toContain(
      '<i class="ion-plus-round"></i> Unfollow CodingDodo'
    );

    // Unfollow now
    fetch.mockResponseOnce(
      JSON.stringify({
        profile: {
          username: "CodingDodo",
          bio: null,
          image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
          following: false,
        },
      })
    );
    await fixture.querySelector("button[name='toggleFollow']").click();
    await nextTick();
    expect(updateFollowingEventHandler).toBeCalledTimes(2);
    // calls[1] to get the second call to the handler
    detail = updateFollowingEventHandler.mock.calls[1][0].detail;
    expect(detail.profile.following).toBe(false);
    expect(detail.profile.username).toBe("CodingDodo");
    Object.assign(props.article, { author: detail.profile });
    await comp.render();
    await nextTick();
    expect(fixture.innerHTML).toContain(
      '<i class="ion-plus-round"></i> Follow CodingDodo<'
    );
  });
});
