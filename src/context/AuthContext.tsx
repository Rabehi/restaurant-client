import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

type User = {
    id: number;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password
            });

            const userData = response.data.user;
            setUser(userData);
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (error: any) {
            const message =
                error.response?.data?.error || 'Error al iniciar sesión';
            throw new Error(message);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            await axios.post('http://localhost:3000/api/register', {
                email,
                password
            });

            await login(email, password);
        } catch (error: any) {
            const message =
                error.response?.data?.error || 'Error al registrarse';
            throw new Error(message);
        }
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
