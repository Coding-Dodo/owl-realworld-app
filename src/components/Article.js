import { Component, tags, router, hooks, useState } from "@odoo/owl";
import { ArticleMeta } from "./ArticleMeta";
import { useApi } from "../hooks/useApi";
const { useGetters } = hooks;
const Link = router.Link;

const ARTICLE_TEMPLATE = tags.xml/*xml*/ `
<div class="article-preview">
    <ArticleMeta 
        article="props.article"  
        t-on-update-favorited="updateFavorited"
        updatingFavorited="state.updatingFavorited"
        articlesListMode="true"
      />
    <Link to="'ARTICLE'" params="{slug: props.article.slug}" class="preview-link">
        <h1><t t-esc="props.article.title"/></h1>
        <p><t t-esc="props.article.description"/></p>
        <span>Read more...</span>
    </Link>
</div>
`;
export class Article extends Component {
  static template = ARTICLE_TEMPLATE;
  static components = { Link, ArticleMeta };
  state = useState({
    updatingFavorited: false,
  });
  getters = useGetters();
  conduitApi = useApi();
  static props = {
    article: { type: Object },
  };
  async updateFavorited(ev) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    Object.assign(this.state, { updatingFavorited: true });
    if (ev.detail.favorited === true) {
      await this.conduitApi.favoriteArticle(this.props.article.slug);
    } else {
      await this.conduitApi.unfavoriteArticle(this.props.article.slug);
    }
    Object.assign(this.state, { updatingFavorited: false });
    Object.assign(this.props.article, ev.detail);
  }
  getArticleDate() {
    let articleDate = new Date(this.props.article.createdAt);
    return articleDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
