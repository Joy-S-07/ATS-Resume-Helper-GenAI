import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})

export async function register({ username , email , password }) {
    try {
        const res = await api.post('/register', {
            username , email , password
        })
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function login({ email , password }) {
    try {
        const res = await api.post('/login', {
            email , password
        })
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function logout() {
    try {
        const res = await api.get('/logout')
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getMe(){
    try {
        const res = await api.get('/get-me')
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function forgotPassword({ email }) {
    try {
        const res = await api.post('/forgot-password', { email });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function resetPassword({ token, password }) {
    try {
        const res = await api.post('/reset-password', { token, password });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}