import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserType = 'employee' | 'employer';

interface UserContextType {
  userType: UserType | null;
  setUserType: (type: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    // Initialize user type from localStorage on mount
    const storedUserType = localStorage.getItem('role') as UserType;
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('role', type);
  };

  return (
    <UserContext.Provider value={{ userType, setUserType: handleSetUserType }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 