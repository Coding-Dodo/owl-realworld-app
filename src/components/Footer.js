import { Component, tags } from "@odoo/owl";

const FOOTER_TEMPLATE = tags.xml/*xml*/ `
<footer>
    <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
    </div>
</footer>
`;
export class Footer extends Component {
  static template = FOOTER_TEMPLATE;
}
