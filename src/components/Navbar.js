import { Component, tags } from "@odoo/owl";

const NAVBAR_TEMPLATE = tags.xml/*xml*/ `
<nav class="navbar navbar-light">
    <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
                <!-- Add "active" class when you're on that page" -->
                <a class="nav-link active" href="">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">
                    <i class="ion-compose"></i> New Post
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">
                    <i class="ion-gear-a"></i> Settings
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Sign in</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="">Sign up</a>
            </li>
        </ul>
    </div>
</nav>
`;
export class Navbar extends Component {
  static template = NAVBAR_TEMPLATE;
}
