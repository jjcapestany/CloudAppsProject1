import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginButton = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleClick = async () => {
        if (isAuthenticated) {
            await logout();
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="flex items-center gap-4">
            {isAuthenticated && user && (
                <span className="text-[#BF5700] text-sm">{user.email}</span>
            )}
            <button
                className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer w-40 font-bold"
                onClick={handleClick}
            >
                <span className="mx-auto">{isAuthenticated ? "LOG OUT" : "LOGIN"}</span>
            </button>
        </div>
    );
}
