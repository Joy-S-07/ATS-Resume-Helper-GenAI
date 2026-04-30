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

export async function login({ username , email , password }) {

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