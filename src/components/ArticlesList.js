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
        currentOffset="state.currentOffset"
        t-on-update-offset="updateOffset"
    />
</section>
`;
// Here only for demonstration of using hooks
// function useLoader() {
//   const component = Component.current;
//   const conduitApi = useApi();
//   const state = useState({
//     articles: [],
//     articlesCount: 0,
//     loading: false,
//   });
//   async function fetchArticles(queryOptions) {
//     let response = {};
//     Object.assign(state, { loading: true });
//     if (queryOptions.feed == true) {
//       response = await conduitApi.getArticlesFeed(queryOptions);
//     } else {
//       response = await conduitApi.getArticles(queryOptions);
//     }
//     Object.assign(state, response);
//     Object.assign(state, { loading: false });
//   }
//   onWillStart(async () => {
//     fetchArticles(component.props.queryOptions);
//   });
//   onWillUpdateProps(async (nextProps) => {
//     fetchArticles(nextProps.queryOptions);
//   });
//   return state;
// }
export class ArticlesList extends Component {
  static template = ARTICLESLIST_TEMPLATE;
  static components = { Article, Pagination };
  conduitApi = useApi();
  state = useState({
    articles: [],
    articlesCount: 0,
    loading: false,
    currentOffset: 0,
  });
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

  async fetchArticles(queryOptions) {
    let response = {};
    let queryParams = { ...queryOptions };
    queryParams.offset = this.state.currentOffset;
    Object.assign(this.state, { loading: true });
    if (queryParams.feed == true) {
      response = await this.conduitApi.getArticlesFeed(queryParams);
    } else {
      response = await this.conduitApi.getArticles(queryParams);
    }
    Object.assign(this.state, response);
    Object.assign(this.state, { loading: false });
  }

  async willStart() {
    this.fetchArticles(this.props.queryOptions);
  }

  async willUpdateProps(nextProps) {
    if (
      nextProps.queryOptions == this.props.queryOptions &&
      nextProps.queryOptions.offset == this.state.currentOffset
    ) {
      return;
    }
    this.state.currentOffset = this.props.queryOptions.offset;
    this.fetchArticles(nextProps.queryOptions);
  }

  updateOffset(ev) {
    this.state.currentOffset = ev.detail.offset;
    this.fetchArticles(this.props.queryOptions);
  }
}
