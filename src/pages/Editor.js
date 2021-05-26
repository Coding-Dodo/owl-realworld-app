import { Component, tags, useState, hooks } from "@odoo/owl";
const { useGetters } = hooks;
import { useApi } from "../hooks/useApi";
const { xml } = tags;

const EDITOR_TEMPLATE = xml/* xml */ `
<div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <ul class="error-messages">
            <li t-foreach="state.errors" t-as="errorKey">
                <t t-esc="errorKey"/> <t t-esc="state.errors[errorKey]"/> 
            </li>
        </ul>
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" t-model="state.article.title" t-att-disabled="state.publishingArticle"/>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" t-model="state.article.description" t-att-disabled="state.publishingArticle"/>
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" t-model="state.article.body" t-att-disabled="state.publishingArticle"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" t-att-disabled="state.publishingArticle"/><div class="tag-list"></div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button" t-att-disabled="state.publishingArticle" t-on-click.prevent="publishArticle">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
`;
export class Editor extends Component {
  static template = EDITOR_TEMPLATE;
  getters = useGetters();
  state = useState({
    article: {
      slug: "",
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
    publishingArticle: false,
    errors: {},
  });
  conduitApi = useApi();
  async fetchArticle(slug) {
    let response = await this.conduitApi.getArticle(slug);
    if (
      response &&
      response.article &&
      response.article.author.username == this.getters.getUser().username
    ) {
      Object.assign(this.state, response);
    }
  }
  async willStart() {
    if (this.env.router.currentParams && this.env.router.currentParams.slug) {
      let slug = this.env.router.currentParams.slug;
      await this.fetchArticle(slug);
    }
  }

  async publishArticle() {
    let response = {};
    Object.assign(this.state, { publishingArticle: true });
    if (this.state.article.slug) {
      response = await this.conduitApi.updateArticle(
        this.state.article.slug,
        this.state.article
      );
    } else {
      response = await this.conduitApi.createArticle(this.state.article);
    }
    Object.assign(this.state, { publishingArticle: false });
    if (response.article) {
      this.env.router.navigate({
        to: "PROFILE",
        params: { username: this.getters.getUser().username },
      });
    } else {
      Object.assign(this.state.errors, response.errors);
    }
  }
}
