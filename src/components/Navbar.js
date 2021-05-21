import { Component, tags, router, hooks } from "@odoo/owl";
const { useGetters } = hooks;
const Link = router.Link;
import { NavbarLink } from "./NavbarLink";

const NAVBAR_TEMPLATE = tags.xml/*xml*/ `
<nav class="navbar navbar-light">
    <div class="container">
        <!-- <a class="navbar-brand" href="index.html">conduit</a> -->
        <Link to="'HOME'" class="navbar-brand">conduit</Link>
        <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
                <!-- Add "active" class when you're on that page" -->
                <NavbarLink to="'HOME'" class="nav-link">Home</NavbarLink>
            </li>
            <li class="nav-item">
                <NavbarLink to="'EDITOR'" class="nav-link nav-link-editor"><i class="ion-compose"></i> New Post</NavbarLink>
            </li>
            <li class="nav-item">
                <NavbarLink to="'SETTINGS'" class="nav-link" t-if="userLoggedIn()"><i class="ion-gear-a"></i> Settings</NavbarLink>
            </li>
            <li class="nav-item">
                <NavbarLink to="'LOG_IN'" class="nav-link" t-if="!userLoggedIn()">Sign in</NavbarLink>
            </li>
            <li class="nav-item">
                <NavbarLink to="'REGISTER'" class="nav-link" t-if="!userLoggedIn()">Sign up</NavbarLink>
            </li>
            <li class="nav-item">
                <NavbarLink to="'PROFILE'" class="nav-link">Coding Dodo</NavbarLink>
            </li>
        </ul>
    </div>
</nav>
`;
export class Navbar extends Component {
  static template = NAVBAR_TEMPLATE;
  static components = { Link, NavbarLink };
  getters = useGetters();

  userLoggedIn() {
    return this.getters.userLoggedIn();
  }
}
