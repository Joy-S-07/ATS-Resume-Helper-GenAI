import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, logout, register, getMe } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email , password }) => {
        setLoading(true);
        try{
            const data = await login({ email , password })
            setUser(data.user)
            return true;
        }
        catch (error){
            console.error(error);
            return false;
        }
        finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({ email , password }) => {
        setLoading(true);
        try{
            const data = await register({ email , password })
            setUser(data.user)
        }
        catch (error){
            toast.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try{
            const data = await logout();
        }
        catch (error){
            toast.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    const handleGetMe = async () => {
        setLoading(true);
        try{
            const data = await getMe();
            setUser(data.user)
        }
        catch (error){
            toast.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    return { handleLogin , handleRegister , handleLogout , handleGetMe , user , loading };
}