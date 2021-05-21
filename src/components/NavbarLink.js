import { tags, router } from "@odoo/owl";
const Link = router.Link;
const { xml } = tags;

const LINK_TEMPLATE = xml/* xml */ `
<a  t-att-class="{'active': isActive }"
    t-att-href="href"
    t-on-click="navigate">
    <t t-slot="default"/>
</a>
`;
export class NavbarLink extends Link {
  static template = LINK_TEMPLATE;
}
