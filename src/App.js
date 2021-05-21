import { Component, tags, router } from "@odoo/owl";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
const RouteComponent = router.RouteComponent;
const Link = router.Link;

const APP_TEMPLATE = tags.xml/*xml*/ `
<main>
  <Navbar/>
  <RouteComponent/>
  <Footer/>
</main>
`;

export class App extends Component {
  static components = { Footer, Navbar, RouteComponent, Link };
  static template = APP_TEMPLATE;
}
