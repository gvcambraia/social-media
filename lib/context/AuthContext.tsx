'use client';

import { User } from '@/app/generated/prisma/client';
import { createContext, ReactNode, useContext, useState } from 'react';

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
