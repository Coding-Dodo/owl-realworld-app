import { Component, tags, useState } from "@odoo/owl";
import { ArticlePreview } from "./ArticlePreview";
import { Pagination } from "./Pagination";
import { useApi } from "../hooks/useApi";

const ARTICLESLIST_TEMPLATE = tags.xml/*xml*/ `
<section>
    <t t-foreach="state.articles" t-as="article" t-key="article.slug">
        <ArticlePreview article="article"/>
    </t>
    <span class="loading-articles" t-if="state.loading">
        Loading Articles...
    </span>
    <Pagination 
        itemsPerPage="props.queryOptions.limit" 
        totalCount="state.articlesCount"
        currentOffset="props.queryOptions.offset"
    />
</section>
`;
export class ArticlesList extends Component {
  static template = ARTICLESLIST_TEMPLATE;
  static components = { ArticlePreview, Pagination };
  conduitApi = useApi();
  state = useState({
    articles: [],
    articlesCount: 0,
    loading: false,
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
    Object.assign(this.state, { loading: true });
    if (queryOptions.feed == true) {
      response = await this.conduitApi.getArticlesFeed(queryOptions);
    } else {
      response = await this.conduitApi.getArticles(queryOptions);
    }
    Object.assign(this.state, response);
    Object.assign(this.state, { loading: false });
  }

  async willStart() {
    console.log("willStart");
    this.fetchArticles(this.props.queryOptions);
  }

  async willUpdateProps(nextProps) {
    if (nextProps.queryOptions == this.props.queryOptions) {
      return;
    }
    Object.assign(this.state, { articles: [] });
    this.fetchArticles(nextProps.queryOptions);
  }
}
