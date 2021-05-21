import { App } from "./App";
import { utils, router, mount, QWeb, Store } from "@odoo/owl";
import { LogIn, Register, Home, Settings, Editor, Profile } from "./pages";
import { useApi } from "./hooks/useApi";

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
};

async function makeEnvironment() {
  const env = { qweb: new QWeb() };
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
    console.log(store.state);
  });
  return store;
}

async function setup() {
  App.env = await makeEnvironment();
  App.env.store = makeStore();
  mount(App, { target: document.body });
}

utils.whenReady(setup);
