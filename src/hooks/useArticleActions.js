import { useState, hooks } from "@odoo/owl";
const { useEnv, useGetters, useComponent } = hooks;
import { useApi } from "../hooks/useApi";

export function useArticleActions() {
  const conduitApi = useApi();
  const env = useEnv();
  const getters = useGetters();
  const comp = useComponent();
  const state = useState({
    updatingFavorited: false,
    deltingArticle: false,
  });
  const updateFavorited = async (slug, favorited) => {
    if (!getters.userLoggedIn()) {
      env.router.navigate({ to: "LOG_IN" });
      return;
    }
    let response = {};
    Object.assign(state, { updatingFavorited: true });
    if (favorited === true) {
      response = await conduitApi.favoriteArticle(slug);
    } else {
      response = await conduitApi.unfavoriteArticle(slug);
    }
    Object.assign(state, { updatingFavorited: false });
    comp.trigger("update-favorited", {
      article: response.article,
    });
    return response.article;
  };
  const deleteArticle = async (slug) => {
    conduitApi.deleteArticle(ev.detail.slug);
    env.router.navigate({
      to: "PROFILE",
      params: { username: getters.getUser().username },
    });
  };

  return { state, updateFavorited, deleteArticle };
}
