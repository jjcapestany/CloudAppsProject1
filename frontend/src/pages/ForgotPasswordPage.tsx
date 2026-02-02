import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to send reset email');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="grow bg-[#333f48] flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-[#BF5700] mb-4">Check Your Email</h2>
                    <p className="text-gray-600 mb-6">
                        If an account exists with that email, we've sent a password reset link.
                    </p>
                    <Link to="/login" className="text-[#BF5700] hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grow bg-[#333f48] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-[#BF5700] mb-6">Forgot Password</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <p className="text-gray-600 mb-4 text-center">
                    Enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-3 rounded"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#BF5700] text-white p-3 rounded font-bold hover:bg-[#a04a00] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending...' : 'SEND RESET LINK'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    <Link to="/login" className="text-[#BF5700] hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};
