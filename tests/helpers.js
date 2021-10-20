import { Component } from "@odoo/owl";
import "regenerator-runtime/runtime";

import { router, QWeb, Store } from "@odoo/owl";

import { LogIn, Register, Home, Settings, Editor, Profile } from "../src/pages";

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

export function click(elem, selector) {
  elem.querySelector(selector).dispatchEvent(new Event("click"));
}
