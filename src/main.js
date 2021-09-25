import { App } from "./App";
import { utils, router, mount, QWeb } from "@odoo/owl";
import { LogIn, Register, Home, Settings, Editor, Profile } from "./pages";

export const ROUTES = [
  { name: "HOME", path: "/", component: Home },
  { name: "LOG_IN", path: "/login", component: LogIn },
  { name: "REGISTER", path: "/register", component: Register },
  { name: "SETTINGS", path: "/settings", component: Settings },
  { name: "EDITOR", path: "/editor", component: Editor },
  { name: "PROFILE", path: "/profile", component: Profile },
];

async function makeEnvironment() {
  const env = { qweb: new QWeb() };
  env.router = new router.Router(env, ROUTES, { mode: "hash" });
  await env.router.start();
  return env;
}

async function setup() {
  App.env = await makeEnvironment();
  mount(App, { target: document.body });
}

utils.whenReady(setup);
