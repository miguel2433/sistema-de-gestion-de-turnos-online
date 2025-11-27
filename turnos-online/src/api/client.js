const API_URL = import.meta.env.VITE_API_URL ?? "http://10.120.2.227:5000";

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  let json = null;
  try {
    json = await response.json();
  } catch {
    // puede no haber cuerpo JSON
  }

  if (!response.ok || (json && json.ok === false)) {
    const message = json?.error || json?.message || `Error ${response.status}`;
    throw new Error(message);
  }

  return json?.data ?? json;
}
