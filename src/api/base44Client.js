const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const tokenKey = 'showcardetial_access_token';

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem(tokenKey);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) { const e = new Error(data?.message || data?.title || `Request failed (${res.status})`); e.status = res.status; e.data = data; throw e; }
  return data;
}

const entityApi = (name) => ({
  list: (sort, limit = 100) => request(`/entities/${name}?sort=${encodeURIComponent(sort || '')}&limit=${limit}`),
  filter: (filter = {}, sort, limit = 100) => request(`/entities/${name}?sort=${encodeURIComponent(sort || '')}&limit=${limit}&filter=${encodeURIComponent(JSON.stringify(filter))}`),
  get: (id) => request(`/entities/${name}/${id}`),
  create: (data) => request(`/entities/${name}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/entities/${name}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/entities/${name}/${id}`, { method: 'DELETE' }),
});

export const base44 = {
  entities: {
    Car: entityApi('Car'), Brand: entityApi('Brand'), GalleryImage: entityApi('GalleryImage'), Visit: entityApi('Visit'),
    Review: entityApi('Review'), User: entityApi('User'), Contact: entityApi('Contact'), News: entityApi('News')
  },
  integrations: { Core: { UploadFile: async ({ file }) => request('/files/upload', { method: 'POST', body: (() => { const f = new FormData(); f.append('file', file); return f; })() }) } },
  auth: {
    me: () => request('/auth/me'),
    loginViaEmailPassword: async (email, password) => { const r = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); localStorage.setItem(tokenKey, r.access_token); return r; },
    register: async ({ email, password }) => { const r = await request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }); return r; },
    verifyOtp: async ({ email, otpCode }) => { const r = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: otpCode }) }); return r; },
    resendOtp: async () => ({ ok: true }),
    setToken: (token) => localStorage.setItem(tokenKey, token),
    logout: () => localStorage.removeItem(tokenKey),
    redirectToLogin: () => { window.location.href = '/login'; },
    loginWithProvider: () => { throw new Error('Google login is not configured in local mode. Use email and password.'); },
    resetPasswordRequest: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: ({ resetToken, newPassword }) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ resetToken, newPassword }) }),
  }
};
