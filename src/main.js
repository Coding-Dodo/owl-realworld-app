import { App } from "./App";
import {
  utils,
  router,
  mount,
  QWeb,
  Store,
  config as owlConfig,
} from "@odoo/owl";
import {
  LogIn,
  Register,
  Home,
  Settings,
  Editor,
  Profile,
  ArticlePage,
} from "./pages";

async function authRoute({ env, to }) {
  if (!env.store.getters.userLoggedIn()) {
    return { to: "LOG_IN" };
  }
  return true;
}

export const ROUTES = [
  { name: "HOME", path: "/", component: Home },
  { name: "LOG_IN", path: "/login", component: LogIn },
  { name: "REGISTER", path: "/register", component: Register },
  {
    name: "SETTINGS",
    path: "/settings",
    component: Settings,
    beforeRouteEnter: authRoute,
  },
  {
    name: "EDITOR",
    path: "/editor",
    component: Editor,
    beforeRouteEnter: authRoute,
  },
  {
    name: "EDITOR_ARTICLE",
    path: "/editor/{{slug}}",
    component: Editor,
    beforeRouteEnter: authRoute,
  },
  {
    name: "PROFILE",
    path: "/profile/@{{username}}",
    component: Profile,
  },
  {
    name: "ARTICLE",
    path: "/article/{{slug}}",
    component: ArticlePage,
  },
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
  const localState = window.localStorage.getItem("owl-realworld-app");
  const state = localState ? JSON.parse(localState) : initialState;
  const store = new Store({ state, actions, getters });
  store.on("update", null, () => {
    localStorage.setItem("owl-realworld-app", JSON.stringify(store.state));
  });
  return store;
}

async function setup() {
  if (process.env.OWL_ENV === "dev") {
    owlConfig.mode = "dev";
  }
  let store = makeStore();
  App.env = await makeEnvironment(store);
  mount(App, { target: document.body });
}

utils.whenReady(setup);
