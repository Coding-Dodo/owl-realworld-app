import {
  LogIn,
  Register,
  Home,
  Settings,
  Editor,
  Profile,
  ArticlePage,
} from "./pages";

async function authRoute({ env, to }) {
  if (!env.store.getters.userLoggedIn()) {
    return { to: "LOG_IN" };
  }
  return true;
}

export const ROUTES = [
  { name: "HOME", path: "/", component: Home },
  { name: "LOG_IN", path: "/login", component: LogIn },
  { name: "REGISTER", path: "/register", component: Register },
  {
    name: "SETTINGS",
    path: "/settings",
    component: Settings,
    beforeRouteEnter: authRoute,
  },
  {
    name: "EDITOR",
    path: "/editor",
    component: Editor,
    beforeRouteEnter: authRoute,
  },
  {
    name: "EDITOR_ARTICLE",
    path: "/editor/{{slug}}",
    component: Editor,
    beforeRouteEnter: authRoute,
  },
  {
    name: "PROFILE",
    path: "/profile/@{{username}}",
    component: Profile,
  },
  {
    name: "ARTICLE",
    path: "/article/{{slug}}",
    component: ArticlePage,
  },
];
