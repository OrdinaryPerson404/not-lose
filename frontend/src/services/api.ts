import type {
  User,
  Post,
  Match,
  LoginResponse,
  CreatePostRequest,
  CreatePostResponse,
  PostsResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('budu_token');
}

function setToken(token: string): void {
  localStorage.setItem('budu_token', token);
}

function removeToken(): void {
  localStorage.removeItem('budu_token');
}

function getUser(): User | null {
  const userStr = localStorage.getItem('budu_user');
  return userStr ? JSON.parse(userStr) : null;
}

function setUser(user: User): void {
  localStorage.setItem('budu_user', JSON.stringify(user));
}

function removeUser(): void {
  localStorage.removeItem('budu_user');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

export const api = {
  auth: {
    async login(studentId: string, password: string): Promise<LoginResponse> {
      const data = await request<{ success: boolean; token: string; user: User }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ studentId, password })
        }
      );
      
      setToken(data.token);
      setUser(data.user);
      
      return { token: data.token, user: data.user };
    },

    async getProfile(): Promise<User> {
      const data = await request<{ success: boolean; user: User }>('/auth/profile');
      setUser(data.user);
      return data.user;
    },

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
      await request('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword })
      });
    },

    logout(): void {
      removeToken();
      removeUser();
    },

    getCurrentUser(): User | null {
      return getUser();
    },

    isLoggedIn(): boolean {
      return !!getToken();
    }
  },

  posts: {
    async getList(params?: {
      type?: 'clue' | 'search';
      status?: number;
      location?: string;
      page?: number;
      limit?: number;
    }): Promise<PostsResponse> {
      const searchParams = new URLSearchParams();
      if (params?.type) searchParams.set('type', params.type);
      if (params?.status !== undefined) searchParams.set('status', String(params.status));
      if (params?.location) searchParams.set('location', params.location);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      const query = searchParams.toString();
      return request<PostsResponse>(`/posts${query ? `?${query}` : ''}`);
    },

    async getById(id: number): Promise<Post> {
      const data = await request<{ success: boolean; post: Post }>(`/posts/${id}`);
      return data.post;
    },

    async create(post: CreatePostRequest): Promise<CreatePostResponse> {
      const data = await request<{ success: boolean; message: string; post: Post; matchResult?: any }>(
        '/posts',
        {
          method: 'POST',
          body: JSON.stringify(post)
        }
      );
      return { post: data.post, matchResult: data.matchResult };
    },

    async updateStatus(id: number, status: number): Promise<Post> {
      const data = await request<{ success: boolean; message: string; post: Post }>(
        `/posts/${id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status })
        }
      );
      return data.post;
    },

    async getMyPosts(): Promise<Post[]> {
      const data = await request<{ success: boolean; posts: Post[] }>('/posts/user/my');
      return data.posts;
    }
  },

  match: {
    async getList(): Promise<Match[]> {
      const data = await request<{ success: boolean; matches: Match[] }>('/match');
      return data.matches;
    },

    async confirm(matchId: number): Promise<void> {
      await request('/match/confirm', {
        method: 'POST',
        body: JSON.stringify({ matchId })
      });
    }
  }
};

export default api;
