import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 🧹 Clear session/local storage
        sessionStorage.clear(); // or localStorage.clear()

        // 🔁 Redirect to login
        navigate("/login", { replace: true });
    }, [navigate]);


    return null;
}

export default Login
