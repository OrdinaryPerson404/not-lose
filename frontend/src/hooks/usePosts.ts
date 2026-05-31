import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Post, CreatePostRequest, MatchResult } from '../types';

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  filters: {
    type?: 'clue' | 'search';
    status?: number;
    location?: string;
  };
  setFilters: (filters: Partial<UsePostsReturn['filters']>) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  createPost: (post: CreatePostRequest) => Promise<{ post: Post; matchResult?: MatchResult }>;
  updatePostStatus: (id: number, status: number) => Promise<void>;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFiltersState] = useState<{
    type?: 'clue' | 'search';
    status?: number;
    location?: string;
  }>({});

  const loadPosts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.posts.getList({
        ...filters,
        page: pageNum,
        limit: 20
      });

      if (append) {
        setPosts(prev => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts);
      }

      setTotal(response.total);
      setHasMore(response.posts.length === 20);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPosts(1, false);
  }, [filters]);

  const setFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await loadPosts(page + 1, true);
  }, [hasMore, isLoading, page, loadPosts]);

  const refresh = useCallback(async () => {
    await loadPosts(1, false);
  }, [loadPosts]);

  const createPost = useCallback(async (post: CreatePostRequest) => {
    const result = await api.posts.create(post);
    await refresh();
    return result;
  }, [refresh]);

  const updatePostStatus = useCallback(async (id: number, status: number) => {
    await api.posts.updateStatus(id, status);
    await refresh();
  }, [refresh]);

  return {
    posts,
    isLoading,
    error,
    total,
    page,
    hasMore,
    filters,
    setFilters,
    loadMore,
    refresh,
    createPost,
    updatePostStatus
  };
}
