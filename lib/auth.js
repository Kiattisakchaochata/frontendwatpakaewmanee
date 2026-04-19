export function setAuth(token, user) {
  localStorage.setItem("token", token);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");

  if (!user || user === "undefined" || user === "null") {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("getUser parse error:", error);
    localStorage.removeItem("user");
    return null;
  }
}

export function removeAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}