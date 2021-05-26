import { Component, tags, useState, hooks } from "@odoo/owl";
const { onWillStart, useEnv, useGetters } = hooks;
import { useApi } from "../hooks/useApi";
import { ArticleMeta } from "../components/ArticleMeta";
import { CommentsSection } from "../components/CommentsSection";
import marked from "marked";

const ARTICLE_PAGE_TEMPLATE = tags.xml/* xml */ `
<div class="article-page">
<t t-if="state.article">
  <div class="banner">
    <div class="container">
      <h1 t-esc="state.article.title"></h1>
      <ArticleMeta 
        article="state.article" 
        t-on-update-following="updateFollowing" 
        t-on-update-favorited="updateFavorited"
        updatingFollowing="state.updatingFollowing"
        updatingFavorited="state.updatingFavorited"
        deletingArticle="state.deletingArticle"
      />
    </div>
  </div>
  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <div t-raw="renderMarkdown(state.article.body)"/>
      </div>
    </div>
    <hr />

    <div class="article-actions">
      <ArticleMeta 
        article="state.article" 
        t-on-update-following="updateFollowing" 
        t-on-update-favorited="updateFavorited"
        updatingFollowing="state.updatingFollowing"
        updatingFavorited="state.updatingFavorited"
        deletingArticle="state.deletingArticle"
      />
    </div>

    <CommentsSection articleSlug="state.article.slug"/>
  </div>
</t>
</div>
`;
export class ArticlePage extends Component {
  static template = ARTICLE_PAGE_TEMPLATE;
  static components = { ArticleMeta, CommentsSection };
  getters = useGetters();
  conduitApi = useApi();
  state = useState({
    article: {
      slug: "",
      title: "",
      description: "",
      body: "",
      tagList: [],
      createdAt: "",
      updatedAt: "",
      favorited: false,
      favoritesCount: 0,
      author: {
        username: "",
        bio: "",
        image: "",
        following: false,
      },
    },
    updatingFollowing: false,
    updatingFavorited: false,
    deletingArticle: false,
  });
  async fetchArticle(slug) {
    let response = await this.conduitApi.getArticle(slug);
    if (response && response.article) {
      Object.assign(this.state, response);
    }
  }
  async willStart() {
    let slug = this.env.router.currentParams.slug;
    await this.fetchArticle(slug);
  }

  renderMarkdown(content) {
    return marked(content);
  }

  async updateFollowing(ev) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    Object.assign(this.state, { updatingFollowing: true });
    if (ev.detail.following === true) {
      await this.conduitApi.followUser(this.state.article.author.username);
    } else {
      await this.conduitApi.unfollowUser(this.state.article.author.username);
    }
    Object.assign(this.state, { updatingFollowing: false });
    Object.assign(this.state.article.author, ev.detail);
  }

  async updateFavorited(ev) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    Object.assign(this.state, { updatingFavorited: true });
    if (ev.detail.favorited === true) {
      await this.conduitApi.favoriteArticle(this.state.article.slug);
    } else {
      await this.conduitApi.unfavoriteArticle(this.state.article.slug);
    }
    Object.assign(this.state, { updatingFavorited: false });
    Object.assign(this.state.article, ev.detail);
  }
}
