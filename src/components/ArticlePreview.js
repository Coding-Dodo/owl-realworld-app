import { Component, tags, router } from "@odoo/owl";
import { ArticleMeta } from "./ArticleMeta";
const Link = router.Link;

const ARTICLE_PREVIEW_TEMPLATE = tags.xml/*xml*/ `
<div class="article-preview">
    <ArticleMeta 
        article="props.article"  
        t-on-update-favorited="onUpdateFavorited"
        articlesListMode="true"
      />
    <Link to="'ARTICLE'" params="{slug: props.article.slug}" class="preview-link">
        <h1><t t-esc="props.article.title"/></h1>
        <p><t t-esc="props.article.description"/></p>
        <span>Read more...</span>
    </Link>
</div>
`;
export class ArticlePreview extends Component {
  static template = ARTICLE_PREVIEW_TEMPLATE;
  static components = { Link, ArticleMeta };
  static props = {
    article: { type: Object },
  };
  onUpdateFavorited(ev) {
    Object.assign(this.props.article, ev.detail.article);
  }
}
