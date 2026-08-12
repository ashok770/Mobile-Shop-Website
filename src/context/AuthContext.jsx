import { createContext, useCallback, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();
const TOKEN_KEY = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        return;
      }

      const res = await authService.getCurrentUser();

      setUser(res.user);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const finishAuth = (res) => {
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res;
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);

    return finishAuth(res);
  };

  const googleLogin = async (credential) => {
    const res = await authService.googleLogin(credential);

    return finishAuth(res);
  };

  const register = async (userData) => {
    await authService.register(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
