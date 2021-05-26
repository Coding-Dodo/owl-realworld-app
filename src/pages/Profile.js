import { Component, tags, useState, hooks, router } from "@odoo/owl";
const { useGetters } = hooks;
const { Link } = router;
import { useApi } from "../hooks/useApi";
import { ArticlesList } from "../components/ArticlesList";
const { xml } = tags;

const PROFILE_TEMPLATE = xml/* xml */ `
<div class="profile-page">
    <div class="user-info">
        <div class="container">
            <div class="row">

            <div class="col-xs-12 col-md-10 offset-md-1">
                <img t-att-src="state.profile.image" class="user-img" />
                <h4 t-esc="state.profile.username"></h4>
                <p t-esc="state.profile.bio"></p>
                <t t-if="state.profile.username == getters.getUser().username">
                    <Link to="'SETTINGS'" class="btn btn-sm btn-outline-secondary action-btn">
                        <i class="ion-gear-a"></i> Edit Profile Settings
                    </Link>
                </t>
                <t t-else="">
                    <button 
                        class="btn btn-sm btn-outline-secondary action-btn" 
                        t-attf-class="btn btn-sm action-btn {{ state.profile.following ? 'btn-secondary' : 'btn-outline-secondary' }}" 
                        t-att-disabled="state.updatingFollowing"
                        t-on-click.prevent="updateFollowing"
                    >
                        <i class="ion-plus-round"></i> <t t-esc="state.profile.following ? 'Unfollow' : 'Follow'"/> <t t-esc="state.profile.username"/>
                    </button>
                </t>
            </div>

            </div>
        </div>
    </div>

    <div class="container">
    <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
                <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                    <a t-attf-class="nav-link {{ state.navigationMode == 'AUTHOR' ? 'active' : '' }}"
                        href="" 
                        t-on-click.prevent="changeNavigationMode('AUTHOR')">
                    My Articles
                    </a>
                </li>
                <li class="nav-item">
                    <a  t-attf-class="nav-link {{ state.navigationMode == 'FAVORITED' ? 'active' : '' }}"
                        href="" 
                        t-on-click.prevent="changeNavigationMode('FAVORITED')">
                        Favorited Articles
                    </a>
                </li>
                </ul>
            </div>
            <ArticlesList queryOptions="state.articlesOptions"/>
        </div>
    </div>
    </div>
</div>
`;

export class Profile extends Component {
  static template = PROFILE_TEMPLATE;
  static components = { ArticlesList, Link };
  conduitApi = useApi();
  getters = useGetters();
  state = useState({
    profile: {},
    navigationMode: "",
    articlesOptions: {},
    updatingFollowing: false,
  });

  async fetchProfile(username) {
    let response = await this.conduitApi.getProfile(username);
    if (response && response.profile) {
      Object.assign(this.state, {
        ...response,
        navigationMode: "AUTHOR",
        articlesOptions: {
          author: response.profile.username,
          limit: 10,
          offset: 0,
        },
      });
    }
  }

  async updateFollowing() {
    if (!this.getters.userLoggedIn()) {
      this.env.router.navigate({ to: "LOG_IN" });
      return;
    }
    let newFollowingState = !this.state.profile.following;
    Object.assign(this.state, { updatingFollowing: true });
    if (newFollowingState === true) {
      await this.conduitApi.followUser(this.state.profile.username);
    } else {
      await this.conduitApi.unfollowUser(this.state.profile.username);
    }
    Object.assign(this.state, { updatingFollowing: false });
    Object.assign(this.state.profile, { following: newFollowingState });
  }

  async willUpdateProps() {
    let username = this.env.router.currentParams.username;
    await this.fetchProfile(username);
  }

  async willStart() {
    let username = this.env.router.currentParams.username;
    await this.fetchProfile(username);
  }

  changeNavigationMode(navigationMode) {
    let articlesOptions = {};
    switch (navigationMode) {
      case "AUTHOR":
        articlesOptions = {
          author: this.state.profile.username,
          limit: 10,
          offset: 0,
        };
        break;
      case "FAVORITED":
        articlesOptions = {
          favorited: this.state.profile.username,
          limit: 10,
          offset: 0,
        };
        break;
      default:
        articlesOptions = {
          author: this.state.profile.username,
          limit: 10,
          offset: 0,
        };
    }
    Object.assign(this.state, {
      navigationMode: navigationMode,
      articlesOptions: articlesOptions,
    });
  }
}
