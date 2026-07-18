import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Signuppage() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/customers/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone || null,
                    address: formData.address || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Signup failed');
                return;
            }

            toast.success('Account created successfully! Please login.');
            navigate('/login', { replace: true });
        } catch (error) {
            toast.error(error.message || 'Backend connection failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md" onSubmit={handleSignup}>
                <h2 className="mb-6 text-xl font-bold text-gray-900">Create Account</h2>
                
                <input
                    type="text"
                    placeholder="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <input
                    type="email"
                    placeholder="Email *"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <input
                    type="password"
                    placeholder="Password *"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <input
                    type="tel"
                    placeholder="Phone (optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <textarea
                    placeholder="Address (optional)"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-green-600 hover:text-green-700">Login</Link>
                </p>
            </form>
        </div>
    )
}
