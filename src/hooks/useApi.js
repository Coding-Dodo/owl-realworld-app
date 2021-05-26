import { hooks } from "@odoo/owl";
const { useStore } = hooks;
import axios from "axios";
axios.defaults.baseURL = "https://conduit.productionready.io/api"; // the prefix of the URL
axios.defaults.headers.get["Accept"] = "application/json"; // default header for all get request
axios.defaults.headers.post["Accept"] = "application/json"; // default header for all POST request

class ApiService {
  constructor(token) {
    if (token) {
      axios.defaults.headers.common = { Authorization: `Token ${token}` };
    } else {
      axios.defaults.headers.common = {};
    }
  }

  async user() {
    let response = {};
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
  async getArticles(queryOptions) {
    let response = {};
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
    await axios
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
