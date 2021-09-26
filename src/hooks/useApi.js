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
}
export function useApi() {
  const user = useStore((state) => state.user);
  let token = "";
  if (user && user.token) {
    token = user.token;
  }
  return new ApiService(token);
}
