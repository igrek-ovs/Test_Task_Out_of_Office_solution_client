import React, { createContext, useContext, useState } from 'react';

type UserRole = 'admin' | 'projectManager' | 'user';

interface AuthContextProps {
    role: UserRole;
    setRole: React.Dispatch<React.SetStateAction<UserRole>>;
}

const AuthContext = createContext<AuthContextProps>({
    role: 'user',
    setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<UserRole>('user');

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};
