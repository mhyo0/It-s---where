const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

function getAuthHeader(token?: string) {
  if (!token) {
    // If not passed, try to get from local storage (if in browser)
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) token = storedToken;
    }
  }
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function fetchAPI(endpoint: string, options: RequestInit = {}, token?: string) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(token),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// ---------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------

export const authAPI = {
  register: async (data: { email: string; username: string; password: string; preferred_language?: string; postal_code?: string }) => {
    return fetchAPI('/auth/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    return fetchAPI('/auth/user/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return fetchAPI('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: { email: string }) => {
    return fetchAPI('/auth/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: { email: string; code: string; new_password: string }) => {
    return fetchAPI('/auth/user/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  adminLogin: async (data: { admin_slug: string; password: string }) => {
    return fetchAPI('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

// ---------------------------------------------------------
// USERS
// ---------------------------------------------------------

export const usersAPI = {
  getMe: async () => {
    return fetchAPI('/users/me', { method: 'GET' });
  },

  updateMe: async (data: { preferred_language?: string; postal_code?: string }) => {
    return fetchAPI('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deactivateMe: async () => {
    return fetchAPI('/users/me', { method: 'DELETE' });
  },

  getFavourites: async () => {
    return fetchAPI('/users/me/favourites', { method: 'GET' });
  },

  addFavourite: async (categoryId: string) => {
    return fetchAPI(`/users/me/favourites/${categoryId}`, { method: 'POST' });
  },

  removeFavourite: async (categoryId: string) => {
    return fetchAPI(`/users/me/favourites/${categoryId}`, { method: 'DELETE' });
  },

  discoverByWilaya: async (wilaya: string, params?: { status?: string; skip?: number; limit?: number }) => {
    const query = new URLSearchParams({ wilaya, ...(params as any) }).toString();
    return fetchAPI(`/users/me/events/discover/wilaya?${query}`, { method: 'GET' });
  },

  discoverByCommune: async (commune: string, params?: { status?: string; skip?: number; limit?: number }) => {
    const query = new URLSearchParams({ commune, ...(params as any) }).toString();
    return fetchAPI(`/users/me/events/discover/commune?${query}`, { method: 'GET' });
  },

  getMyEvents: async () => {
    return fetchAPI('/users/me/events', { method: 'GET' });
  },

  registerEvent: async (eventId: string) => {
    return fetchAPI(`/users/me/events/${eventId}`, { method: 'POST' });
  },

  unregisterEvent: async (eventId: string) => {
    return fetchAPI(`/users/me/events/${eventId}`, { method: 'DELETE' });
  }
};

// ---------------------------------------------------------
// EVENTS
// ---------------------------------------------------------

export const eventsAPI = {
  getAll: async (params?: { skip?: number; limit?: number; wilaya?: string; postal_code?: string; category_id?: string; status?: string; lang?: string; active_only?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI(`/events?${query}`, { method: 'GET' });
  },

  getById: async (id: string, lang?: string) => {
    const query = lang ? `?lang=${lang}` : '';
    return fetchAPI(`/events/${id}${query}`, { method: 'GET' });
  },

  create: async (data: any) => {
    return fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI(`/events/${id}`, { method: 'DELETE' });
  }
};

// ---------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------

export const categoriesAPI = {
  getAll: async () => {
    return fetchAPI('/categories', { method: 'GET' });
  },

  getById: async (id: string) => {
    return fetchAPI(`/categories/${id}`, { method: 'GET' });
  },

  create: async (data: { name: string; description?: string; is_active?: boolean }) => {
    return fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchAPI(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI(`/categories/${id}`, { method: 'DELETE' });
  }
};
