import { Component } from "@odoo/owl";

import { router, QWeb, Store } from "@odoo/owl";
import { ROUTES } from "../src/routes";

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
    return true;
    if (state.user && state.user.token) {
      return true;
    }
    return false;
  },
  getUser({ state }) {
    return state.user;
  },
};

export async function makeEnvironment(store) {
  const env = { qweb: new QWeb(), store: store };
  env.router = new router.Router(env, ROUTES, { mode: "hash" });
  await env.router.start();
  return env;
}

export function makeStore() {
  const state = initialState;
  const store = new Store({ state, actions, getters });
  return store;
}

export async function nextTick() {
  return new Promise(function (resolve) {
    setTimeout(() =>
      Component.scheduler.requestAnimationFrame(() => resolve())
    );
  });
}
export function makeTestParentFixture() {
  let fixture = document.createElement("main");
  document.body.appendChild(fixture);
  return fixture;
}
export function makeTestFixture(parent) {
  let fixture = document.createElement("main");
  if (parent) {
    parent.appendChild(fixture);
  } else {
    document.body.appendChild(fixture);
  }
  return fixture;
}
