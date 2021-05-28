import { Component, tags, router, hooks, useState } from "@odoo/owl";
import { ArticleMeta } from "./ArticleMeta";
import { useApi } from "../hooks/useApi";
const { useGetters } = hooks;
const Link = router.Link;

const ARTICLE_TEMPLATE = tags.xml/*xml*/ `
<div class="article-preview">
    <ArticleMeta 
        article="props.article"  
        t-on-update-favorited="onUpdateFavorited"
        t-on-update-following="onUpdateFollowing"
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

  getArticleDate() {
    let articleDate = new Date(this.props.article.createdAt);
    return articleDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  onUpdateFavorited(ev) {
    console.log(ev.detail);
  }
}
