import { hooks } from "@odoo/owl";
const { useStore } = hooks;
import axios from "redaxios";

class ApiService {
  constructor(token) {
    let config = {
      baseURL: "https://conduit.productionready.io/api",
      timeout: 1000,
    };
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    this.service = axios.create(config);
  }

  async user() {
    let response = {};
    await this.service
      .get("/user")
      .then((res) => {
        if (res.data && res.data.user) {
          response = res.data.user;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }

  async login(email, password) {
    let response = {};
    await this.service
      .post("/users/login", {
        user: {
          email: email,
          password: password,
        },
      })
      .then((res) => {
        if (res.data && res.data.user) {
          response = res.data.user;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async register(username, email, password) {
    let response = {};
    await this.service
      .post("/users", {
        user: {
          username: username,
          email: email,
          password: password,
        },
      })
      .then((res) => {
        if (res.data && res.data.user) {
          response = res.data.user;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          console.log(error.response.data);
          response = error.response.data;
        }
      });
    return response;
  }
  async updateUser(userData) {
    let response = {};
    await this.service
      .put("/user", {
        user: userData,
      })
      .then((res) => {
        if (res.data && res.data.user) {
          response = res.data.user;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async getArticle(slug) {
    let response = {};
    await this.service
      .get(`/articles/${slug}`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
          console.log(response);
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async createArticle(title, description, body, tagList) {
    let response = {};
    await this.service
      .post(`/articles`, {
        article: {
          title: title,
          description: description,
          body: body,
          tagList: tagList,
        },
      })
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
          console.log(response);
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async deleteArticle(slug) {
    let response = {};
    await this.service
      .delete(`/articles/${slug}`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async getArticles(queryOptions) {
    let response = {};
    await this.service
      .get("/articles", { params: queryOptions })
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
          console.log(response);
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async getArticlesFeed(queryOptions) {
    let response = {};
    await this.service
      .get("/articles/feed", { params: queryOptions })
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async getTags() {
    let response = {};
    await this.service
      .get("/tags")
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async getComments(slug) {
    let response = {};
    await this.service
      .get(`/articles/${slug}/comments`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async addComment(slug, body) {
    let response = {};
    await this.service
      .post(`/articles/${slug}/comments`, {
        comment: {
          body: body,
        },
      })
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async deleteComment(slug, commentId) {
    let response = {};
    await this.service
      .delete(`/articles/${slug}/comments/${commentId}`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async unfavoriteArticle(slug) {
    let response = {};
    await this.service
      .delete(`/articles/${slug}/favorite`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async favoriteArticle(slug) {
    let response = {};
    await this.service
      .post(`/articles/${slug}/favorite`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async followUser(username) {
    let response = {};
    await this.service
      .post(`/profiles/${username}/follow`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
  async unfollowUser(username) {
    let response = {};
    await this.service
      .delete(`/profiles/${username}/follow`)
      .then((res) => {
        if (res.data && res.data) {
          response = res.data;
        }
      })
      .catch((error) => {
        if (error && error.response) {
          response = error.response.data;
        }
      });
    return response;
  }
}
export function useApi() {
  const user = useStore((state) => state.user);
  let token = "";
  if (user && user.token) {
    token = user.token;
  }
  return new ApiService(token);
}
