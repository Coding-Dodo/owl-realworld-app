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
        t-on-update-following="updateFollowing" 
        t-on-update-favorited="updateFavorited"
        t-on-delete-article="deleteArticle"
        updatingFollowing="state.updatingFollowing"
        updatingFavorited="state.updatingFavorited"
        deletingArticle="state.deletingArticle"
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
        t-on-update-following="updateFollowing" 
        t-on-update-favorited="updateFavorited"
        t-on-delete-article="deleteArticle"
        updatingFollowing="state.updatingFollowing"
        updatingFavorited="state.updatingFavorited"
        deletingArticle="state.deletingArticle"
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

  async deleteArticle(ev) {
    await this.conduitApi.deleteArticle(ev.detail.slug);
    this.env.router.navigate({
      to: "PROFILE",
      params: { username: this.getters.getUser().username },
    });
  }

  async updateFollowing(ev) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    Object.assign(this.state, { updatingFollowing: true });
    if (ev.detail.following === true) {
      await this.conduitApi.followUser(
        this.articleState.article.author.username
      );
    } else {
      await this.conduitApi.unfollowUser(
        this.articleState.article.author.username
      );
    }
    Object.assign(this.state, { updatingFollowing: false });
    Object.assign(this.articleState.article.author, ev.detail);
  }

  async updateFavorited(ev) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    Object.assign(this.state, { updatingFavorited: true });
    if (ev.detail.favorited === true) {
      await this.conduitApi.favoriteArticle(this.articleState.article.slug);
    } else {
      await this.conduitApi.unfavoriteArticle(this.articleState.article.slug);
    }
    Object.assign(this.state, { updatingFavorited: false });
    Object.assign(this.articleState.article, ev.detail);
  }
}
