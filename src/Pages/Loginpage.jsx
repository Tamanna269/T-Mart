import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Loginpage( { setIsLoggedIn } ) {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || '/';
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/customers/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Login failed');
                return;
            }

            // Store customer data in localStorage
            localStorage.setItem('customer', JSON.stringify(data.customer));
            localStorage.setItem('isLoggedIn', 'true');
            
            setIsLoggedIn(true);
            toast.success(data.message || "Login successful!");
            navigate(redirectPath, { replace: true });
        } catch (error) {
            toast.error(error.message || 'Backend connection failed');
        } finally {
            setLoading(false);
        }
      }
  return (
    <div>
     <form className="mx-auto max-w-md rounded-lg
      bg-white p-8 shadow-md" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"  
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
         
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <a href="/signup" className="text-green-600 hover:text-green-700">Sign up</a>
        </p>
      </form>
    </div>
  )
}
