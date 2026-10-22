import { useState, useEffect, useCallback } from "react";
import { authApi } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState<{ username: string; is_active: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    setUser(res.data);
    return res.data;
  };

  return { user, loading, login, isAuthenticated: !!user };
}