import { Component, tags, hooks, router } from "@odoo/owl";
const { useGetters } = hooks;
const { Link } = router;
import { useApi } from "../hooks/useApi";
import { useArticleActions } from "../hooks/useArticleActions";
import { useProfileActions } from "../hooks/useProfileActions";
import { formatDate } from "../utilities/formatDate";

const ARTICLE_META_PAGE_TEMPLATE = tags.xml/* xml */ `
<div class="article-meta">
    <a href=""><img t-att-src="props.article.author.image" /></a>
    <div class="info">
        <Link to="'PROFILE'" params="{username: props.article.author.username}" class="author" t-esc="props.article.author.username"></Link>
        <span class="date" t-esc="formatDate(props.article.createdAt)"></span>
    </div>
    <!-- Articles List mode with only heart button -->
    <t t-if="props.articlesListMode">
        <button t-attf-class="btn btn-sm pull-xs-right {{ props.article.favorited ? 'btn-primary': 'btn-outline-primary' }}" t-att-disabled="articleActions.state.updatingFavorited" t-on-click="articleActions.updateFavorited(props.article.slug, !props.article.favorited)">
            <i class="ion-heart"></i> <t t-esc="props.article.favoritesCount"/>
        </button>
    </t>
    <!-- Article Page mode with following/favorite/edit/delete conditional buttons -->
    <t t-else="">
        <span t-if="userIsAuthor()">
            <Link class="btn btn-outline-secondary btn-sm" to="'EDITOR_ARTICLE'" params="{ slug: props.article.slug }">
                <i class="ion-edit"></i> Edit Article
            </Link>

            <button t-attf-class="btn btn-outline-danger btn-sm" t-on-click.prevent="deleteArticle">
                <i class="ion-trash-a"></i> Delete Article
            </button>
        </span>
        <span t-else="">
            <button 
                t-attf-class="btn btn-sm {{ props.article.author.following ? 'btn-secondary' : 'btn-outline-secondary' }}" 
                t-on-click="profileActions.updateFollowing(props.article.author.username, !props.article.author.following)" 
                t-att-disabled="profileActions.state.updatingFollowing"
            >
                <i class="ion-plus-round"></i> <t t-esc="props.article.author.following ? 'Unfollow' : 'Follow'"/> <t t-esc="props.article.author.username"/>
            </button> 
            <button 
                t-attf-class="btn btn-sm {{ props.article.favorited ? 'btn-primary': 'btn-outline-primary' }}" 
                t-att-disabled="articleActions.state.updatingFavorited" 
                t-on-click="articleActions.updateFavorited(props.article.slug, !props.article.favorited)"
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
  static props = {
    article: { type: Object },
    articlesListMode: { type: Boolean, optional: true },
  };
  staticconduitApi = useApi();
  getters = useGetters();
  articleActions = useArticleActions();
  profileActions = useProfileActions();
  static formatDate = formatDate;

  userIsAuthor() {
    return (
      this.getters.userLoggedIn() &&
      this.getters.getUser().username == this.props.article.author.username
    );
  }
}
