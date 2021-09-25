import { useState, hooks } from "@odoo/owl";
const { useEnv, useGetters, useComponent } = hooks;
import { useApi } from "../hooks/useApi";

export function useProfileActions() {
  const conduitApi = useApi();
  const env = useEnv();
  const getters = useGetters();
  const comp = useComponent();
  const state = useState({
    updatingFollowing: false,
  });
  const updateFollowing = async (username, following) => {
    if (!getters.userLoggedIn()) {
      env.router.navigate({ to: "LOG_IN" });
      return;
    }
    let response = {};
    Object.assign(state, { updatingFollowing: true });
    if (following === true) {
      response = await conduitApi.followUser(username);
    } else {
      response = await conduitApi.unfollowUser(username);
    }
    Object.assign(state, { updatingFollowing: false });
    comp.trigger("update-following", {
      profile: response.profile,
    });
    return response.profile;
  };
  return { state, updateFollowing };
}
