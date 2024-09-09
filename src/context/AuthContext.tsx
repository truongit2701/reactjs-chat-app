import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  username: string,
  avatar: string,
  id: number
}

interface AuthContextType {
  authState: AuthState;
  login: (token: string, role: string, username: string, avatar: string, id: number) => void;
  updateAvatar: (avatar: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Đọc trạng thái xác thực từ localStorage khi khởi động
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuthState = localStorage.getItem('authState');
    return savedAuthState ? JSON.parse(savedAuthState) : { isAuthenticated: false, role: null };
  });
    
  useEffect(() => {
    // Lưu trạng thái xác thực vào localStorage khi authState thay đổi
    localStorage.setItem('authState', JSON.stringify(authState));
  }, [authState]);

  const login = (token: string, role: string, username: string, avatar: string, id:number) => {
    localStorage.setItem('authState', JSON.stringify(authState));
    localStorage.setItem('token', token);
    setAuthState({ isAuthenticated: true, role, username, avatar, id });
  };

  const updateAvatar = (avatar: string) => {
    const updatedAuthState = { ...authState, avatar };
    localStorage.setItem('authState', JSON.stringify(updatedAuthState));
    setAuthState({ ...authState, avatar });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authState');
    setAuthState({ isAuthenticated: false, role: null, username: '', avatar: '', id: 0 });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
