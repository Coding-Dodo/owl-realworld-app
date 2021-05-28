import { Component, tags, hooks, useState } from "@odoo/owl";
const { useGetters } = hooks;
import { useApi } from "../hooks/useApi";
import { formatDate } from "../utilities/formatDate";

const COMMENTS_SECTION_TEMPLATE = tags.xml/*xml*/ `
<div class="row">
  <div class="col-xs-12 col-md-8 offset-md-2">
    <form class="card comment-form" t-if="getters.userLoggedIn()">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3" t-model="state.newComment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img t-att-src="getters.getUser().image" class="comment-author-img" />
        <button 
          class="btn btn-sm btn-primary" 
          t-on-click.prevent="postNewComment" 
          t-att-disabled="state.addingComment">
            Post Comment
        </button>
      </div>
    </form>

    <span t-if="state.loadingComments">Loading comments...</span>
    <t t-foreach="state.comments" t-as="comment" t-key="comment.id">
      <div class="card">
        <div class="card-block">
          <p class="card-text" t-esc="comment.body">
          </p>
        </div>
        <div class="card-footer">
          <a href="" class="comment-author">
            <img
              t-att-src="comment.author.image"
              class="comment-author-img"
            />
          </a> <a href="" class="comment-author" t-esc="comment.author.username"></a>
          <span class="date-posted" t-esc="formatDate(comment.createdAt)"></span>
          <span class="mod-options" t-if="getters.getUser().username == comment.author.username">
            <i 
              class="ion-trash-a" 
              t-att-disabled="state.deletingComment"
              t-on-click.prevent="deleteComment(comment.id)">
            </i>
          </span>
        </div>
      </div>
    </t>
  </div>
</div>

`;
export class CommentsSection extends Component {
  static template = COMMENTS_SECTION_TEMPLATE;
  static components = {};
  conduitApi = useApi();
  getters = useGetters();
  static formatDate = formatDate;
  state = useState({
    comments: [],
    loadingComments: false,
    addingComment: false,
    deletingComment: false,
    newComment: "",
  });
  static props = {
    articleSlug: {
      type: String,
    },
  };
  conduitApi = useApi();

  async fetchComments(slug) {
    Object.assign(this.state, { loadingComments: true });
    let response = await this.conduitApi.getComments(slug);
    Object.assign(this.state, response);
    Object.assign(this.state, { loadingComments: false });
  }

  async willStart() {
    this.fetchComments(this.props.articleSlug);
  }

  async postNewComment() {
    Object.assign(this.state, {
      addingComment: true,
      loadingComments: true,
      comments: [],
    });
    if (!this.state.newComment) {
      return;
    }
    await this.conduitApi.addComment(
      this.props.articleSlug,
      this.state.newComment
    );
    Object.assign(this.state, { addingComment: false, newComment: "" });
    this.fetchComments(this.props.articleSlug);
  }

  async deleteComment(id) {
    Object.assign(this.state, {
      deletingComment: true,
      loadingComments: true,
      comments: [],
    });
    await this.conduitApi.deleteComment(this.props.articleSlug, id);
    Object.assign(this.state, {
      deletingComment: false,
      newComment: "",
      comments: [],
    });
    this.fetchComments(this.props.articleSlug);
  }
}
