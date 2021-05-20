import { Component, useState, tags } from "@odoo/owl";

export class App extends Component {
  state = useState({ text: "Owl" });
  update() {
    this.state.text = this.state.text === "Owl" ? "World" : "Owl";
  }
}

App.template = tags.xml/*xml*/ `
<div t-name="App" class="bg-white shadow m-8 p-2 rounded cursor-pointer" t-on-click="update">
  Hello <t t-esc="state.text"/>
</div>
`;
