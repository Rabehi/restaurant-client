import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthButtons = () => {
    const { user, login, register, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        acceptLOPD: false
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginClick = (): void => {
        setIsLoginOpen(!isLoginOpen);
        setIsRegisterOpen(false);
        setError(null);
    };

    const handleRegisterClick = (): void => {
        setIsRegisterOpen(!isRegisterOpen);
        setIsLoginOpen(false);
        setError(null);
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(loginData.email, loginData.password);
            setIsLoginOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registerData.acceptLOPD) {
            setError('Debes aceptar la LOPD para registrarte');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await register(registerData.email, registerData.password);
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return (
            <div className="flex justify-end gap-3 mt-4 mr-5">
                <span className="mr-3">Hola, {user.email}</span>
                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-full font-bold text-white bg-red-400 hover:bg-red-500 transition-colors duration-300"
                >
                    Cerrar sesión
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-end gap-3 mt-4 mr-5">
            <button
                className="px-4 py-2 rounded-full font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={handleLoginClick}
                aria-label="Iniciar sesión"
            >
                Iniciar sesión
            </button>
            <button
                className="px-4 py-2 rounded-full font-bold text-white bg-red-400 hover:bg-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={handleRegisterClick}
                aria-label="Registrarse"
            >
                Registrarse
            </button>

            {/* Modal de Login */}
            {isLoginOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => {
                        setIsLoginOpen(false);
                        setError(null);
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-lg w-full max-w-md"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-4">
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-red-400 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            >
                                Acceder
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Registro */}
            {isRegisterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => {
                        setIsRegisterOpen(false);
                        setError(null);
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-lg w-full max-w-md"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Registrarse</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="mb-4">
                                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="register-email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="register-password"
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                    required
                                />
                            </div>
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    id="accept-lopd"
                                    name="acceptLOPD"
                                    checked={registerData.acceptLOPD}
                                    onChange={handleRegisterChange}
                                    className="h-4 w-4 text-red-400 focus:ring-red-400 border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="accept-lopd" className="ml-2 block text-sm text-gray-700">
                                    Acepto la LOPD
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-red-400 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                            >
                                Registrarse
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthButtons;
