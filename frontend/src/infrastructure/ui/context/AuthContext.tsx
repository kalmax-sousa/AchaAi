import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '@/domain/entities/user';

// Criação do contexto fora do componente
const AuthContext = createContext<{
    user: User | null;
    login: (userData: User) => Promise<void>;
    logout: () => void;
} | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (userData: User): Promise<void> => {
        try {
            const response = { data: userData }; // Chamada API simulada
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    const logout = (): void => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

// Custom hook para usar o contexto de forma mais fácil
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};