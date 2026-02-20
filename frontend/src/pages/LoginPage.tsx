import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/projects';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ email, password, rememberMe });
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grow bg-[#333f48] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#BF5700] mb-6">Login</h2>

                {error && (
                    <div data-testid="login-error" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-testid="login-form">
                    <input
                        data-testid="login-email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-3 rounded"
                        required
                    />
                    <input
                        data-testid="login-password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-3 rounded"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-[#BF5700] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        data-testid="login-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#BF5700] text-white p-3 rounded font-bold hover:bg-[#a04a00] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Logging in...' : 'LOGIN'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#BF5700] hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};
