import { App } from "../../src/components/App";
import { makeTestFixture, nextTick, click } from "../helpers";
import { mount } from "@odoo/owl";

let fixture;

beforeEach(() => {
  fixture = makeTestFixture();
});

afterEach(() => {
  fixture.remove();
});

describe("App", () => {
  test("Works as expected...", async () => {
    await mount(App, { target: fixture });
    expect(fixture.innerHTML).toContain("Hello Owl");

    click(fixture, "div");
    await nextTick();
    expect(fixture.innerHTML).toContain("Hello World");
  });
});
