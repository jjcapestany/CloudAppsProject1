import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword(token, password, confirmPassword);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="grow bg-[#333f48] flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
                    <p className="text-gray-600 mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link to="/forgot-password" className="text-[#BF5700] hover:underline">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="grow bg-[#333f48] flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Password Reset!</h2>
                    <p className="text-gray-600 mb-6">
                        Your password has been reset. Redirecting to login...
                    </p>
                    <Link to="/login" className="text-[#BF5700] hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grow bg-[#333f48] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#BF5700] mb-6">Reset Password</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-3 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 p-3 rounded"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#BF5700] text-white p-3 rounded font-bold hover:bg-[#a04a00] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Resetting...' : 'RESET PASSWORD'}
                    </button>
                </form>
            </div>
        </div>
    );
};
