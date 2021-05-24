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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
        console.log(res);
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
  async getArticles(queryOptions) {
    let response = {};
    await axios
      .get("/articles", { params: queryOptions })
      .then((res) => {
        console.log(res);
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
        console.log(res);
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
