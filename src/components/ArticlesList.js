import { Component, tags, hooks, useState } from "@odoo/owl";
const { onWillUpdateProps, onWillStart } = hooks;
import { Article } from "./Article";
import { Pagination } from "./Pagination";
import { useApi } from "../hooks/useApi";

const ARTICLESLIST_TEMPLATE = tags.xml/*xml*/ `
<section>
    <span class="loading-articles" t-if="state.loading">
        Loading Articles...
    </span>
    <t t-foreach="state.articles" t-as="article">
        <Article article="article"/>
    </t>
    <span class="loading-articles" t-if="state.loading">
        Loading Articles...
    </span>
    <Pagination 
        itemsPerPage="props.queryOptions.limit" 
        totalCount="state.articlesCount"
        currentOffset="props.queryOptions.offset"
        t-on-update-offset="updateOffset"
    />
</section>
`;
function useLoader() {
  const component = Component.current;
  const conduitApi = useApi();
  const state = useState({
    articles: [],
    articlesCount: 0,
    loading: false,
  });
  async function fetchArticles(queryOptions) {
    let response = {};
    if (queryOptions.feed == true) {
      response = await conduitApi.getArticlesFeed(queryOptions);
    } else {
      response = await conduitApi.getArticles(queryOptions);
    }
    Object.assign(state, response);
    Object.assign(state, { loading: false });
  }
  onWillStart(() => {
    Object.assign(state, { loading: true });
    fetchArticles(component.props.queryOptions);
  });
  onWillUpdateProps((nextProps) => {
    Object.assign(state, { loading: true });
    fetchArticles(nextProps.queryOptions);
  });
  return state;
}
export class ArticlesList extends Component {
  static template = ARTICLESLIST_TEMPLATE;
  static components = { Article, Pagination };
  state = useLoader();
  static props = {
    queryOptions: {
      type: Object,
      optional: true,
      tag: { type: String, optional: true },
      author: { type: String, optional: true },
      favorited: { type: String, optional: true },
      limit: { type: Number, optional: true },
      feed: { type: Boolean, optional: true },
      offset: { type: Number, optional: true },
    },
  };
  conduitApi = useApi();

  updateOffset(ev) {
    Object.assign(this.props.queryOptions, ev.detail);
  }
}
