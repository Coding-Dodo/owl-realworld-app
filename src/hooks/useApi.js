import { hooks } from "@odoo/owl";
const { useStore } = hooks;
import axios from "axios";
axios.defaults.baseURL = "https://conduit.productionready.io/api"; // the prefix of the URL
axios.defaults.headers.get["Accept"] = "application/json"; // default header for all get request
axios.defaults.headers.post["Accept"] = "application/json"; // default header for all POST request

class ApiService {
  constructor(token) {
    if (token) {
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    } else {
      axios.defaults.headers.common = {};
    }
  }

  async user() {
    let user = {};
    await axios
      .get("/user")
      .then((res) => {
        console.log(res);
        if (res.data && res.data.user) {
          user = res.data.user;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return user;
  }

  async updateUser(email, bio, image) {
    let user = {};
    await axios
      .post("/user", {
        user: {
          email: email,
          bio: bio,
          image: image,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data && res.data.user) {
          user = res.data.user;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return user;
  }

  async login(email, password) {
    let user = {};
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
          user = res.data.user;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return user;
  }
  async register(username, email, password) {
    let user = {};
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
          user = res.data.user;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return user;
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
