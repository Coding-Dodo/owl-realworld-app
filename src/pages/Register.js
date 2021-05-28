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

        <ul class="error-messages">
            <li t-foreach="state.errors" t-as="errorKey">
                <t t-esc="errorKey"/> <t t-esc="state.errors[errorKey]"/> 
            </li>
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
          <button class="btn btn-lg btn-primary pull-xs-right" t-on-click.prevent="register" t-att-disabled="state.loading">
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
    errors: {},
    loading: false,
  });

  async register() {
    if (this.state.loading) return;
    this.state.errors = {};
    this.state.loading = true;
    let response = await this.conduitApi.register(
      this.state.username,
      this.state.email,
      this.state.password
    );
    if (response && response.token) {
      this.state.loading = false;
      this.dispatch("login", response);
      this.env.router.navigate({ to: "HOME" });
    } else {
      if (response.errors) {
        this.state.errors = response.errors;
      }
    }
    this.state.loading = false;
  }
}
