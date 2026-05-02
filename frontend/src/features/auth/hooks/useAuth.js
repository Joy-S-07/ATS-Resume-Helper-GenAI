import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, logout, register, getMe } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return { success: true };
        } catch (error) {
            const message = error?.response?.data?.message || "Login failed. Please try again.";
            console.error("Login error:", message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return { success: true };
        } catch (error) {
            const message = error?.response?.data?.message || "Registration failed. Please try again.";
            console.error("Register error:", message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            return { success: true };
        } catch (error) {
            const message = error?.response?.data?.message || "Logout failed.";
            console.error("Logout error:", message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const handleGetMe = async () => {
        setLoading(true);
        try {
            const data = await getMe();
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("GetMe error:", error?.response?.data?.message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, handleRegister, handleLogout, handleGetMe, user, loading };
};