import { Component, tags, useState } from "@odoo/owl";
import { useApi } from "../hooks/useApi";
const { xml } = tags;

const EDITOR_TEMPLATE = xml/* xml */ `
<div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" t-model="state.title" t-att-disabled="state.publishingArticle"/>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" t-model="state.description" t-att-disabled="state.publishingArticle"/>
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" t-model="state.body" t-att-disabled="state.publishingArticle"></textarea>
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
  state = useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
    publishingArticle: false,
  });
  conduitApi = useApi();
  async publishArticle() {
    if (!this.state.body || !this.state.title || !this.state.description) {
      return;
    }
    Object.assign(this.state, { publishingArticle: true });
    await this.conduitApi.createArticle(
      this.state.title,
      this.state.description,
      this.state.body
    );
    Object.assign(this.state, { publishingArticle: false });
    this.env.router.navigate({ to: "HOME" });
  }
}
