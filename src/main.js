import { App } from "./App";
import {
  utils,
  router,
  mount,
  QWeb,
  Store,
  config as owlConfig,
} from "@odoo/owl";
import { ROUTES } from "./routes";
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
