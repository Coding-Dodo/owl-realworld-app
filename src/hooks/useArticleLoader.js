import { useState, hooks } from "@odoo/owl";
const { onWillStart, useEnv, onWillUpdateProps } = hooks;
import { useApi } from "../hooks/useApi";

export function useArticleLoader() {
  const conduitApi = useApi();
  const article = useState({
    slug: "",
    title: "",
    description: "",
    body: "",
    tagList: [],
    createdAt: "",
    updatedAt: "",
    favorited: false,
    favoritesCount: 0,
    author: {
      username: "",
      bio: "",
      image: "",
      following: false,
    },
  });
  const env = useEnv();
  async function fetchArticle(slug) {
    let response = await conduitApi.getArticle(slug);
    if (response && response.article) {
      Object.assign(article, response.article);
    }
  }
  onWillStart(async () => {
    let slug = env.router.currentParams.slug;
    await fetchArticle(slug);
  });
  onWillUpdateProps(async (nextProps) => {
    if (nextProps.slug !== undefined) {
      await fetchArticle(nextProps.slug);
    }
  });
  return article;
}
