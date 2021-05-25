import { Component, tags, useState, hooks } from "@odoo/owl";
const { onWillStart } = hooks;
import { useApi } from "../hooks/useApi";

const TAGS_CLOUD_TEMPLATE = tags.xml/*xml*/ `
<div class="col-md-3">
    <div class="sidebar">
        <p>Popular Tags</p>
        <div class="tag-list">
            <t t-foreach="state.tags" t-as="tag">
                <a href="#" class="tag-pill tag-default" t-on-click.prevent="tagSelected(tag)">
                    <t t-esc="tag"/>
                </a>
            </t>
        </div>
    </div>
</div>
`;
function useLoader() {
  const conduitApi = useApi();
  const state = useState({
    tags: [],
    loading: false,
  });
  async function fetchTags() {
    let response = await conduitApi.getTags();
    Object.assign(state, response);
    Object.assign(state, { loading: false });
  }
  onWillStart(() => {
    Object.assign(state, { loading: true });
    fetchTags();
  });
  return state;
}
export class TagsCloud extends Component {
  static template = TAGS_CLOUD_TEMPLATE;
  state = useLoader();

  tagSelected(tag) {
    this.trigger("tag-selected", {
      tag: tag,
    });
  }
}
