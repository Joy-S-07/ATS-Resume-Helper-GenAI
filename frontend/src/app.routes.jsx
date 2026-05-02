import { createBrowserRouter, Outlet } from 'react-router'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import ForgotPassword from './features/auth/pages/ForgotPassword.jsx'
import ResetPassword from './features/auth/pages/ResetPassword.jsx'
import LandingPage from './features/landing/LandingPage.jsx'
import Dashboard from './features/dashboard/Dashboard.jsx'
import Navbar from './components/Navbar.jsx'

function RootLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <LandingPage />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "/reset-password",
                element: <ResetPassword />
            },
        ]
    }
])
