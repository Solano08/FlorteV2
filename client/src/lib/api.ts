const DEFAULT_API_URL = "http://localhost:5000/api";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;

export const endpoints = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  profile: (id: number | string) => `${API_BASE_URL}/profile/${id}`,
  profileAvatar: (id: number | string) => `${API_BASE_URL}/profile/${id}/avatar`,
  profileCover: (id: number | string) => `${API_BASE_URL}/profile/${id}/cover`,
  dashboard: (id: number | string) => `${API_BASE_URL}/dashboard/${id}`,
  projects: `${API_BASE_URL}/projects`,
  projectsByUser: (userId: number | string) => `${API_BASE_URL}/projects?usuarioId=${userId}`,
  projectDetail: (projectId: number | string, userId?: number | string) =>
    `${API_BASE_URL}/projects/${projectId}${userId ? `?usuarioId=${userId}` : ""}`,
  posts: `${API_BASE_URL}/posts`,
  feed: (query?: string) => `${API_BASE_URL}/posts${query ? `?${query}` : ""}`,
  postReactions: (postId: number | string) => `${API_BASE_URL}/posts/${postId}/reactions`,
  postComments: (postId: number | string) => `${API_BASE_URL}/posts/${postId}/comments`,
};

export const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = typeof data.error === "string" ? data.error : "Error inesperado";
    throw new Error(error);
  }
  return data;
};
