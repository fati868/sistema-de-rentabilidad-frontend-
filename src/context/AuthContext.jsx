import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

const isTokenValid = (t) => {
  if (!t) return false;
  try {
    const { exp } = JSON.parse(atob(t.split(".")[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = sessionStorage.getItem("token");
    if (!isTokenValid(t)) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return null;
    }
    return t;
  });

  const [user, setUser] = useState(() => {
    if (!isTokenValid(sessionStorage.getItem("token"))) return null;
    try {
      const stored = sessionStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken, newUser) => {
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (fields) => {
    const updated = { ...user, ...fields };
    sessionStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
