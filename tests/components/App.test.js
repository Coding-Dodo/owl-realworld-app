import { App } from "../../src/App";
import { makeTestFixture, nextTick, click } from "../helpers";
import { router, mount, QWeb, Store } from "@odoo/owl";

import {
  LogIn,
  Register,
  Home,
  Settings,
  Editor,
  Profile,
} from "../../src/pages";

export const ROUTES = [
  { name: "HOME", path: "/", component: Home },
  { name: "LOG_IN", path: "/login", component: LogIn },
  { name: "REGISTER", path: "/register", component: Register },
  { name: "SETTINGS", path: "/settings", component: Settings },
  { name: "EDITOR", path: "/editor", component: Editor },
  { name: "PROFILE", path: "/profile", component: Profile },
];

const actions = {
  logout({ state }) {
    state.user = {};
  },
  login({ state }, user) {
    state.user = user;
  },
};

const initialState = {
  user: {},
};
const getters = {
  userLoggedIn({ state }) {
    if (state.user && state.user.token) {
      return true;
    }
    return false;
  },
  getUser({ state }) {
    return state.user;
  },
};

async function makeEnvironment(store) {
  const env = { qweb: new QWeb(), store: store };
  env.router = new router.Router(env, ROUTES, { mode: "hash" });
  await env.router.start();
  return env;
}

function makeStore() {
  const state = initialState;
  const store = new Store({ state, actions, getters });
  return store;
}

let fixture;

beforeEach(() => {
  fixture = makeTestFixture();
});

afterEach(() => {
  fixture.remove();
});

describe("App", () => {
  test("App is instantiated as expected...", async () => {
    let store = makeStore();
    App.env = await makeEnvironment(store);
    await mount(App, { target: fixture });
    expect(fixture.innerHTML).toContain("nav");
    expect(fixture.innerHTML).toContain("footer");
    expect(fixture.innerHTML).toContain("A place to share your knowledge.");
  });
});
