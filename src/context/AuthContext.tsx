import { createContext, useContext, useState, ReactNode } from "react";

type User = { email: string; name: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("freshcart_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, _password: string) => {
    const u = { email, name: email.split("@")[0] };
    setUser(u);
    localStorage.setItem("freshcart_user", JSON.stringify(u));
    return true;
  };

  const signup = (name: string, email: string, _password: string) => {
    const u = { email, name };
    setUser(u);
    localStorage.setItem("freshcart_user", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("freshcart_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
