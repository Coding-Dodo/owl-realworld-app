import { App } from "../../src/App";
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
    expect(fixture.innerHTML).toContain("nav");
    expect(fixture.innerHTML).toContain("footer");
    expect(fixture.innerHTML).toContain("A place to share your knowledge.");
    click(fixture, "div.banner");
    await nextTick();
    expect(fixture.innerHTML).toContain(
      "An OWL (Odoo Web Library) RealWorld App"
    );
  });
});
