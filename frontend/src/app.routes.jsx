import { createBrowserRouter, Navigate } from 'react-router'
import Dashboard from './features/auth/pages/Dashboard.jsx'
import Login from './features/auth/pages/Login.jsx'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />
    },
    {
        path: "/login",
        element: <Login />
    }
])
