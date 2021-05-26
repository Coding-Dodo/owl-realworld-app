import { Component, tags, router, hooks } from "@odoo/owl";
const { useGetters } = hooks;
const Link = router.Link;

const ARTICLE_TEMPLATE = tags.xml/*xml*/ `
<div class="article-preview">
    <div class="article-meta">
        <Link to="'PROFILE'"><img t-att-src="props.article.author.image" /></Link>
        <div class="info">
            <a href="" class="author"><t t-esc="props.article.author.username"/></a>
            <span class="date"><t t-esc="getArticleDate()"/></span>
        </div>
        <button class="btn btn-outline-primary btn-sm pull-xs-right">
            <i class="ion-heart"></i> <t t-esc="props.article.favoritesCount"/>
        </button>
    </div>
    <Link to="'ARTICLE'" params="{slug: props.article.slug}" class="preview-link">
        <h1><t t-esc="props.article.title"/></h1>
        <p><t t-esc="props.article.description"/></p>
        <span>Read more...</span>
    </Link>
</div>
`;
export class Article extends Component {
  static template = ARTICLE_TEMPLATE;
  static components = { Link };
  getters = useGetters();
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
}
