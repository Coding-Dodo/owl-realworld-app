/**
 * @jest-environment jsdom
 */
import { App } from "../../src/App";
import { makeTestFixture, nextTick, click } from "../helpers";
import { mount, router, QWeb } from "@odoo/owl";

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

async function makeEnvironment() {
  const env = { qweb: new QWeb() };
  env.router = new router.Router(env, ROUTES, { mode: "hash" });
  await env.router.start();
  return env;
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
    App.env = await makeEnvironment();
    await mount(App, { target: fixture });
    expect(fixture.innerHTML).toContain("nav");
    expect(fixture.innerHTML).toContain("footer");
    expect(fixture.innerHTML).toContain("A place to share your knowledge.");
    click(fixture, "div.banner");
    await nextTick();
    expect(fixture.innerHTML).toContain(
      "An OWL (Odoo Web Library) RealWorld App"
    );
    click(fixture, "a.nav-link-editor");
    await nextTick();
    expect(fixture.innerHTML).toContain("Publish Article");
  });
});
