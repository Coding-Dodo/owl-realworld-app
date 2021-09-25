import { Component, tags, hooks, useState } from "@odoo/owl";
const { useDispatch, useGetters } = hooks;
const { xml } = tags;
import { useApi } from "../hooks/useApi";

const SETTINGS_TEMPLATE = xml/* xml */ `
<div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        <ul class="error-messages">
            <li t-foreach="state.errors" t-as="errorKey">
                <t t-esc="errorKey"/> <t t-esc="state.errors[errorKey]"/> 
            </li>
        </ul>
        <form>
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" t-model="state.image"/>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" t-model="state.username"/>
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" t-model="state.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" t-model="state.email"/>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password" t-model="state.password"/>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" t-on-click="updateUser">
                Update Settings
              </button>
          </fieldset>
        </form>
        <hr/>
        <button class="btn btn-outline-danger" t-on-click.prevent="logout">Or click here to logout.</button>
      </div>

    </div>
  </div>
</div>
`;

export class Settings extends Component {
  static template = SETTINGS_TEMPLATE;
  dispatch = useDispatch();
  getters = useGetters();
  conduitApi = useApi();

  constructor(...args) {
    super(...args);
    this.state = useState({
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
      errors: {},
      loading: false,
    });
    const storeUser = this.getters.getUser();
    if (storeUser) {
      this.state.image = storeUser.image;
      this.state.username = storeUser.username;
      this.state.bio = storeUser.bio;
      this.state.email = storeUser.email;
    }
  }

  async updateUser(ev) {
    ev.preventDefault();
    if (this.state.loading) return;

    this.state.errors = {};
    this.state.loading = true;
    let userData = {
      image: this.state.image,
      username: this.state.username,
      bio: this.state.bio,
      email: this.state.email,
    };
    if (this.state.password) {
      userData.password = this.state.password;
    }
    let response = await this.conduitApi.updateUser(userData);
    if (response && response.token) {
      this.state.loading = false;
      if (this.state.password) {
        this.dispatch("logout");
        this.env.router.navigate({ to: "LOG_IN" });
      } else {
        this.dispatch("login", response);
        this.env.router.navigate({ to: "HOME" });
      }
    } else {
      if (response.errors) {
        this.state.errors = response.errors;
      }
    }
    this.state.loading = false;
  }

  logout() {
    this.dispatch("logout");
    this.env.router.navigate({ to: "HOME" });
  }
}
