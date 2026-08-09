const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("collabspace_token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register: (payload) =>
    request("/user/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload) =>
    request("/user/login", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

export const documentApi = {
  list: () => request("/document"),

  get: (id) => request(`/document/${id}`),

  create: (payload) =>
    request("/document", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  update: (id, payload) =>
    request(`/document/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),

  remove: (id) =>
    request(`/document/${id}`, {
      method: "DELETE"
    })
};