import { Component, tags, hooks, useState } from "@odoo/owl";
import { ArticlesList } from "../components/ArticlesList";
import { TagsCloud } from "../components/TagsCloud";
const { useGetters } = hooks;

const HOME_TEMPLATE = tags.xml/*xml*/ `
<div class="home-page">

    <div class="banner" t-on-click="updateBanner">
        <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p><t t-esc="state.text"/></p>
        </div>
    </div>

    <div class="container page">
        <div class="row">
            <div class="col-md-9">
                <div class="feed-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li class="nav-item">
                            <a  t-attf-class="nav-link {{ getters.userLoggedIn() ? '' : 'disabled' }} {{ state.navigationMode == 'FEED' ? 'active' : '' }}" 
                                t-on-click.prevent="changeNavigationMode('FEED')"
                                href="/">
                                Your Feed
                            </a>
                        </li>
                        <li class="nav-item">
                            <a  t-attf-class="nav-link {{ state.navigationMode == 'GLOBAL' ? 'active' : '' }}" 
                                t-on-click.prevent="changeNavigationMode('GLOBAL')"
                                href="/">
                                Global Feed
                            </a>
                        </li>
                        <li class="nav-item" t-if="state.navigationMode == 'TAGS' and state.articlesOptions.tag">
                            <a  t-attf-class="nav-link {{ state.navigationMode == 'TAGS' ? 'active' : '' }}" 
                                href="#">
                                <i class="ion-pound"></i> <t t-esc="state.articlesOptions.tag"/>
                            </a>
                        </li>
                    </ul>
                </div>
                <ArticlesList queryOptions="state.articlesOptions"/>
            </div>
            <TagsCloud t-on-tag-selected="onTagSelected"/>
        </div>
    </div>
</div>

`;
export class Home extends Component {
  static template = HOME_TEMPLATE;
  static components = { ArticlesList, TagsCloud };
  getters = useGetters();

  constructor(...args) {
    super(...args);
    let initialNavMode = "GLOBAL";
    let initialArticlesOptions = { limit: 10, offset: 0 };
    if (this.getters.userLoggedIn()) {
      initialNavMode = "FEED";
      initialArticlesOptions = { feed: true, limit: 10, offset: 0 };
    }
    this.state = useState({
      text: "A place to share your knowledge.",
      navigationMode: initialNavMode,
      articlesOptions: initialArticlesOptions,
    });
  }

  changeNavigationMode(navigationMode, tag) {
    if (navigationMode == "FEED" && !this.getters.userLoggedIn()) {
      return;
    }
    let articlesOptions = {};
    switch (navigationMode) {
      case "FEED":
        articlesOptions = { feed: true, limit: 10, offset: 0 };
        break;
      case "TAGS":
        articlesOptions = { tag: tag, limit: 10, offset: 0 };
        break;
      default:
        articlesOptions = { limit: 10, offset: 0 };
    }
    Object.assign(this.state, {
      navigationMode: navigationMode,
      articlesOptions: articlesOptions,
    });
  }

  onTagSelected(ev) {
    this.changeNavigationMode("TAGS", ev.detail.tag);
  }

  updateBanner() {
    this.state.text =
      this.state.text === "A place to share your knowledge."
        ? "An OWL (Odoo Web Library) RealWorld App"
        : "A place to share your knowledge.";
  }
}
