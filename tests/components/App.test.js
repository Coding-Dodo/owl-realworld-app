/**
 * @jest-environment jsdom
 */
import { App } from "../../src/App";
import {
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

beforeEach(async () => {
  fixture = makeTestFixture();
  store = makeStore();
  env = await makeEnvironment(store);
  App.env = env;
});

afterEach(() => {
  fixture.remove();
});

describe("App", () => {
  test("App is instantiated as expected...", async () => {
    await mount(App, { target: fixture });
    expect(fixture.innerHTML).toContain("nav");
    expect(fixture.innerHTML).toContain("footer");
    expect(fixture.innerHTML).toContain(
      'Real world app implementation using <a href="https://github.com/Coding-Dodo/owl-realworld-app">OWL (Odoo Web Library)</a> as standalone'
    );
  });
});
