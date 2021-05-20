import { Component, useState, tags } from "@odoo/owl";
import { Navbar } from "./Navbar";

const APP_TEMPLATE = tags.xml/*xml*/ `
<main>
  <Navbar/>
  <div t-name="App" class="container" t-on-click="update">
    Hello <t t-esc="state.text"/>
  </div>
</main>
`;

export class App extends Component {
  static components = { Navbar };
  static template = APP_TEMPLATE;
  state = useState({ text: "Owl" });
  update() {
    this.state.text = this.state.text === "Owl" ? "World" : "Owl";
  }
}
