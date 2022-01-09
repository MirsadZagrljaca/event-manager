function authenticate(token, callback) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("token", token.token);
    sessionStorage.setItem("id", token.cache._id);
  }

  callback();
}

function isAuthenticated() {
  if (typeof window == "undefined") return false;

  if (!sessionStorage.getItem("token")) return false;

  return sessionStorage.getItem("token");
}

function clearToken(callback) {
  if (typeof window !== "undefined") sessionStorage.removeItem("token");

  callback();
}

/* eslint-disable */

export default { authenticate, isAuthenticated, clearToken };
