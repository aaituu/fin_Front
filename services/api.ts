import {
  Apartment,
  User,
  FilterParams,
  ContactRequest,
  ContactMessagePayload,
  ReportItem,
  ContactMessage
} from '../types';

// Same-origin API. In dev, Vite proxy forwards /api -> backend.
const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, '') : '');

type ApiErrorBody = { message?: string; error?: string };

const getStoredUser = (): User | null => {
  const raw = localStorage.getItem('rentify_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setStoredUser = (u: User | null) => {
  if (!u) localStorage.removeItem('rentify_user');
  else localStorage.setItem('rentify_user', JSON.stringify(u));
};

const authHeaders = () => {
  const u = getStoredUser();
  const token = u?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseError(resp: Response): Promise<string> {
  try {
    const body = (await resp.json()) as ApiErrorBody;
    return body.message || body.error || resp.statusText;
  } catch {
    return resp.statusText;
  }
}

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const resp = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...authHeaders()
    }
  });

  if (!resp.ok) {
    const msg = await parseError(resp);
    throw new Error(msg);
  }

  if (resp.status === 204) return undefined as unknown as T;
  return (await resp.json()) as T;
}

export const api = {
  storage: {
    getStoredUser,
    setStoredUser
  },

  auth: {
    async login(email: string, password: string): Promise<User> {
      const user = await http<User>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setStoredUser(user);
      return user;
    },
    async register(name: string, email: string, password: string): Promise<User> {
      const user = await http<User>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      setStoredUser(user);
      return user;
    }
  },

  users: {
    async me(): Promise<User> {
      return await http<User>('/api/users/me');
    }
  },

  apartments: {
    async list(params: FilterParams & { page?: number; limit?: number; sort?: string } = {}) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
        qs.set(k, String(v));
      });
      return await http<{ items: Apartment[]; page: number; limit: number; total: number }>(
        `/api/apartments?${qs.toString()}`
      );
    },

    async get(id: string): Promise<Apartment> {
      return await http<Apartment>(`/api/apartments/${id}`);
    },

    async create(payload: Partial<Apartment> & { imageUrl?: string }): Promise<Apartment> {
      return await http<Apartment>('/api/apartments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async update(id: string, payload: Partial<Apartment> & { imageUrl?: string }): Promise<Apartment> {
      return await http<Apartment>(`/api/apartments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    },

    async remove(id: string): Promise<void> {
      await http<void>(`/api/apartments/${id}`, { method: 'DELETE' });
    }

    ,
    // Backwards-compatible aliases used in some pages
    async getMine(): Promise<Apartment[]> {
      const r = await api.apartments.list({ owner: 'me', limit: 100 });
      return r.items;
    },
    async delete(id: string): Promise<void> {
      return await api.apartments.remove(id);
    }
  },

  requests: {
    async create(apartmentId: string, phone: string, message: string): Promise<ContactRequest> {
      // Backend returns { success: true, request: {...} }
      const res = await http<{ success: boolean; request: ContactRequest }>(
        `/api/apartments/${apartmentId}/requests`,
        {
        method: 'POST',
        body: JSON.stringify({ phone, message })
        }
      );
      return res.request;
    },
    async incoming(): Promise<ContactRequest[]> {
      const res = await http<{ items: ContactRequest[] }>('/api/requests/incoming');
      return res.items;
    },
    async remove(id: string): Promise<void> {
      await http<void>(`/api/requests/${id}`, { method: 'DELETE' });
    }
    ,
    // Alias
    async delete(id: string): Promise<void> {
      return await api.requests.remove(id);
    }
  },

  contact: {
    async submit(payload: ContactMessagePayload): Promise<{ id: string }> {
      return await http<{ id: string }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  },

  reports: {
    async create(apartmentId: string, reason: string): Promise<{ id: string }> {
      return await http<{ id: string }>(`/api/apartments/${apartmentId}/reports`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    }
  },

  admin: {
    async stats() {
      return await http<{
        users: number;
        apartments: number;
        pending: number;
        approvedVisible: number;
        hidden: number;
        requests: number;
        openReports: number;
      }>('/api/admin/stats');
    },

    async listApartments(params: { status?: string; hidden?: string } = {}) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (!v) return;
        qs.set(k, v);
      });
      return await http<{ items: Apartment[] }>(`/api/admin/apartments?${qs.toString()}`);
    },

    async approveApartment(id: string) {
      return await http<Apartment>(`/api/admin/apartments/${id}/approve`, { method: 'PATCH' });
    },
    async rejectApartment(id: string) {
      return await http<Apartment>(`/api/admin/apartments/${id}/reject`, { method: 'PATCH' });
    },
    async hideApartment(id: string) {
      return await http<Apartment>(`/api/admin/apartments/${id}/hide`, { method: 'PATCH' });
    },
    async unhideApartment(id: string) {
      return await http<Apartment>(`/api/admin/apartments/${id}/unhide`, { method: 'PATCH' });
    },
    async deleteApartment(id: string) {
      await http<void>(`/api/admin/apartments/${id}`, { method: 'DELETE' });
    },

    async listUsers(): Promise<{ items: User[] }> {
      return await http<{ items: User[] }>('/api/admin/users');
    },
    async banUser(id: string, isBanned: boolean): Promise<User> {
      return await http<User>(`/api/admin/users/${id}/ban`, {
        method: 'PATCH',
        body: JSON.stringify({ isBanned })
      });
    },
    async setUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
      return await http<User>(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
      });
    },

    // Contact messages from /contact
    async listMessages(): Promise<{ items: ContactMessage[] }> {
      return await http<{ items: ContactMessage[] }>('/api/admin/messages');
    },
    async deleteMessage(id: string): Promise<void> {
      await http<void>(`/api/admin/messages/${id}`, { method: 'DELETE' });
    },

    async listReports(params: { status?: string } = {}): Promise<{ items: ReportItem[] }> {
      const qs = new URLSearchParams();
      if (params.status) qs.set('status', params.status);
      return await http<{ items: ReportItem[] }>(`/api/admin/reports?${qs.toString()}`);
    },
    async resolveReport(id: string) {
      return await http<ReportItem>(`/api/admin/reports/${id}/resolve`, { method: 'PATCH' });
    },
    async deleteReport(id: string) {
      await http<void>(`/api/admin/reports/${id}`, { method: 'DELETE' });
    }
  }
};
