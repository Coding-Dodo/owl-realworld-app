import { Component, tags } from "@odoo/owl";
const { xml } = tags;

const LOG_IN_TEMPLATE = xml/* xml */ `
<div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <a href="#register">Need an account?</a>
        </p>

        <ul class="error-messages">
          <li>Invalid credentials</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email"/>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password"/>
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
            Sign In
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
`;
export class LogIn extends Component {
  static template = LOG_IN_TEMPLATE;
}
