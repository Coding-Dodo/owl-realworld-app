import { Component, tags, useState, hooks } from "@odoo/owl";
const { useGetters } = hooks;
import { useApi } from "../hooks/useApi";
import { useArticleLoader } from "../hooks/useArticleLoader";
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
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" t-model="articleState.article.title" t-att-disabled="state.publishingArticle"/>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" t-model="articleState.article.description" t-att-disabled="state.publishingArticle"/>
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" t-model="articleState.article.body" t-att-disabled="state.publishingArticle"></textarea>
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
    publishingArticle: false,
    errors: {},
  });
  articleState = useArticleLoader();
  conduitApi = useApi();

  async publishArticle() {
    let response = {};
    Object.assign(this.state, { publishingArticle: true });
    if (this.articleState.article.slug) {
      response = await this.conduitApi.updateArticle(
        this.articleState.article.slug,
        this.articleState.article
      );
    } else {
      response = await this.conduitApi.createArticle(this.articleState.article);
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
