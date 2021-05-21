import { Component } from "@odoo/owl";
import "regenerator-runtime/runtime";

export async function nextTick() {
  return new Promise(function (resolve) {
    setTimeout(() =>
      Component.scheduler.requestAnimationFrame(() => resolve())
    );
  });
}

export function makeTestFixture() {
  let fixture = document.createElement("main");
  document.body.appendChild(fixture);
  return fixture;
}

export function click(elem, selector) {
  elem.querySelector(selector).dispatchEvent(new Event("click"));
}
