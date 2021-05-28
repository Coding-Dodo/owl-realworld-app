import { Component, tags, useState, hooks } from "@odoo/owl";
const { useGetters } = hooks;
import { useApi } from "../hooks/useApi";
import { useArticleLoader } from "../hooks/useArticleLoader";
import { ArticleMeta } from "../components/ArticleMeta";
import { CommentsSection } from "../components/CommentsSection";
import marked from "marked";

const ARTICLE_PAGE_TEMPLATE = tags.xml/* xml */ `
<div class="article-page">
  <div class="banner">
    <div class="container">
      <h1 t-esc="articleState.article.title"></h1>
      <ArticleMeta 
        article="articleState.article" 
        t-on-update-following="onUpdateFollowing" 
        t-on-update-favorited="onUpdateFavorited"
      />
    </div>
  </div>
  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <div t-raw="renderMarkdown(articleState.article.body)"/>
      </div>
    </div>
    <hr />

    <div class="article-actions">
      <ArticleMeta 
        article="articleState.article" 
        t-on-update-following="onUpdateFollowing" 
        t-on-update-favorited="onUpdateFavorited"
      />
    </div>

    <CommentsSection articleSlug="articleState.article.slug"/>
  </div>
</div>
`;

export class ArticlePage extends Component {
  static template = ARTICLE_PAGE_TEMPLATE;
  static components = { ArticleMeta, CommentsSection };
  getters = useGetters();
  conduitApi = useApi();
  state = useState({
    updatingFollowing: false,
    updatingFavorited: false,
    deletingArticle: false,
  });
  articleState = useArticleLoader();

  renderMarkdown(content) {
    return marked(content);
  }

  async onUpdateFollowing(ev) {
    Object.assign(this.articleState.article.author, ev.detail.profile);
  }

  onUpdateFavorited(ev) {
    Object.assign(this.articleState.article, ev.detail.article);
  }
}
