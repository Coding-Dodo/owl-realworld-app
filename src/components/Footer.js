import { Component, tags } from "@odoo/owl";

const FOOTER_TEMPLATE = tags.xml/*xml*/ `
<footer>
    <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
            <br/>
            Real world app implementation using <a href="https://github.com/Coding-Dodo/owl-realworld-app">OWL (Odoo Web Library)</a> as standalone.
        </span>
    </div>
</footer>
`;
export class Footer extends Component {
  static template = FOOTER_TEMPLATE;
}
