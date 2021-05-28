import { Component, tags, hooks, router, useState } from "@odoo/owl";
const { useGetters } = hooks;
const { Link } = router;
import { useApi } from "../hooks/useApi";

const ARTICLE_META_PAGE_TEMPLATE = tags.xml/* xml */ `
<div class="article-meta">
    <a href=""><img t-att-src="props.article.author.image" /></a>
    <div class="info">
        <a href="#" class="author" t-esc="props.article.author.username"></a>
        <span class="date" t-esc="getArticleDate(props.article.createdAt)"></span>
    </div>
    <!-- Articles List mode with only heart button -->
    <t t-if="props.articlesListMode">
        <button t-attf-class="btn btn-sm pull-xs-right {{ props.article.favorited ? 'btn-primary': 'btn-outline-primary' }}" t-att-disabled="state.updatingFavorited" t-on-click="updateFavorited(props.article.slug, !props.article.favorited)">
            <i class="ion-heart"></i> <t t-esc="props.article.favoritesCount"/>
        </button>
    </t>
    <!-- Article Page mode with following/favorite/edit/delete conditional buttons -->
    <t t-else="">
        <span t-if="userIsAuthor()">
            <Link class="btn btn-outline-secondary btn-sm" to="'EDITOR'">
                <i class="ion-edit"></i> Edit Article
            </Link>

            <button t-attf-class="btn btn-outline-danger btn-sm" t-on-click="deleteArticle(props.article.slug)">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </span>
        <span t-else="">
            <button 
                t-attf-class="btn btn-sm {{ props.article.author.following ? 'btn-secondary' : 'btn-outline-secondary' }}" 
                t-on-click="updateFavorited(props.article.author.username, !props.article.author.following)"
                t-att-disabled="state.updatingFollowing"
            >
                <i class="ion-plus-round"></i> <t t-esc="props.article.author.following ? 'Unfollow' : 'Follow'"/> <t t-esc="props.article.author.username"/>
            </button> 
            <button 
                t-attf-class="btn btn-sm {{ props.article.favorited ? 'btn-primary': 'btn-outline-primary' }}" 
                t-att-disabled="state.updatingFavorited" 
                t-on-click="updateFavorited(props.article.slug, !props.article.favorited)"
            >
                <i class="ion-heart"></i> <t t-esc="props.article.favorited ? 'Unfavorite': 'Favorite'"/> Post
                <span class="counter">(<t t-esc="props.article.favoritesCount"/>)</span>
            </button>
        </span>
    </t>
</div>
`;
export class ArticleMeta extends Component {
  static template = ARTICLE_META_PAGE_TEMPLATE;
  static components = { Link };
  conduitApi = useApi();
  getters = useGetters();
  state = useState({
    updatingFollowing: false,
    updatingFavorited: false,
    deletingArticle: false,
  });
  static props = {
    article: { type: Object },
    articlesListMode: { type: Boolean, optional: true },
  };

  getArticleDate(date) {
    let articleDate = new Date(date);
    return articleDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  async updateFavorited(slug, favorited) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    let response = {};
    Object.assign(this.state, { updatingFavorited: true });
    if (favorited === true) {
      response = await this.conduitApi.favoriteArticle(slug);
    } else {
      response = await this.conduitApi.unfavoriteArticle(slug);
    }
    Object.assign(this.state, { updatingFavorited: false });
    this.trigger("update-favorited", {
      article: response.article,
    });
  }

  async updateFollowing(username, following) {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    let response = {};
    Object.assign(this.state, { updatingFollowing: true });
    if (following === true) {
      response = await conduitApi.followUser(username);
    } else {
      response = await conduitApi.unfollowUser(username);
    }
    Object.assign(this.state, { updatingFollowing: false });
    this.trigger("update-following", {
      profile: response.profile,
    });
  }
  async deleteArticle(slug) {
    this.conduitApi.deleteArticle(slug);
    this.env.router.navigate({
      to: "PROFILE",
      params: { username: this.getters.getUser().username },
    });
  }

  userIsAuthor() {
    return (
      this.getters.userLoggedIn() &&
      this.getters.getUser().username == this.props.article.author.username
    );
  }
}
