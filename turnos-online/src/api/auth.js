import { apiFetch } from "./client.js";

export const authApi = {
  login(email, password) {
    return apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
  register(payload) {
    return apiFetch("/auth/register", {
      method: "POST",
      body: payload,
    });
  },
  logout() {
    return apiFetch("/auth/logout", {
      method: "POST",
    });
  },
  me() {
    return apiFetch("/auth/me");
  },
};
