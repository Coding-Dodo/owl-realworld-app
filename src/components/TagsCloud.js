import { Component, tags, useState, hooks } from "@odoo/owl";
import { useApi } from "../hooks/useApi";

const TAGS_CLOUD_TEMPLATE = tags.xml/*xml*/ `
<div class="col-md-3">
    <div class="sidebar">
        <p>Popular Tags</p>
        <div class="tag-list">
            <span t-if="state.loading">Loading tags...</span>
            <t t-foreach="state.tags" t-as="tag">
                <a href="#" class="tag-pill tag-default" t-on-click.prevent="tagSelected(tag)">
                    <t t-esc="tag"/>
                </a>
            </t>
        </div>
    </div>
</div>
`;
export class TagsCloud extends Component {
  static template = TAGS_CLOUD_TEMPLATE;
  state = useState({
    tags: [],
    loading: false,
  });
  conduitApi = useApi();

  async fetchTags() {
    Object.assign(this.state, { loading: true });
    let response = await this.conduitApi.getTags();
    Object.assign(this.state, response);
    Object.assign(this.state, { loading: false });
  }

  async willStart() {
    this.fetchTags();
  }

  tagSelected(tag) {
    this.trigger("tag-selected", {
      tag: tag,
    });
  }
}
