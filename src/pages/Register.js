import { Component, tags, router, hooks, useState } from "@odoo/owl";
const { useDispatch } = hooks;
const Link = router.Link;
const { xml } = tags;
import { useApi } from "../hooks/useApi";

const REGISTER_TEMPLATE = xml/* xml */ `
<div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <Link to="'LOG_IN'">Have an account?</Link>
        </p>

        <ul class="error-messages" t-if="state.registerError">
          <li>That email is already taken</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Your Name" t-model="state.username"/>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email" t-model="state.email"/>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password" t-model="state.password"/>
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right" t-on-click="register" t-att-disabled="state.loading">
            Sign up
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
`;
export class Register extends Component {
  static template = REGISTER_TEMPLATE;
  static components = { Link };
  dispatch = useDispatch();
  conduitApi = useApi();
  state = useState({
    username: "",
    email: "",
    password: "",
    registerError: false,
    loading: false,
  });

  async register(ev) {
    ev.preventDefault();
    if (this.state.loading) return;

    this.state.registerError = false;
    this.state.loading = true;
    let user = await this.conduitApi.register(
      this.state.username,
      this.state.email,
      this.state.password
    );
    if (user && user.token) {
      this.state.loading = false;
      this.dispatch("login", user);
      this.env.router.navigate({ to: "HOME" });
    } else {
      this.state.registerError = true;
    }
    this.state.loading = false;
  }
}
