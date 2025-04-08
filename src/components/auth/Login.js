import React, { useState } from 'react';
import Logo from '../shared/Logo';
import { authService } from '../../services/api';

const Login = ({ onLogin, onForgotPassword, successMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Handle hardcoded credentials directly here
            if (email === "Wilfiesingco@gmail.com" && password === "Adminwilfie@2005") {
                const name = email.split('@')[0];
                
                // Use a simple non-JWT token for development
                const simpleToken = "development_token_wilfie_123456";
                localStorage.setItem('token', simpleToken);
                
                // IMPORTANT: Also update your Django backend to accept this token format
                // You might need to customize the authentication backend in Django
                
                setTimeout(() => {
                    onLogin({ email, name, role: 'Admin', id: 123 });
                    setLoading(false);
                }, 1000);
                return;
            }

            // The hardcoded credentials logic is now moved to the authService.login method
            const response = await authService.login(email, password);
            
            // Handle hardcoded login response
            if (response.user) {
                onLogin(response.user);
            } else {
                // For regular API login
                const userData = await authService.getCurrentUser();
                onLogin(userData);
            }
            setLoading(false);
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-light-blue-100 items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded border border-blue-300 p-8 shadow-md">
                    <Logo />
                    <h2 className="text-center text-xl font-semibold mb-4">Enter your credentials to access your account</h2>
                   
                    {successMessage && (
                        <div className="mb-4 text-green-500 text-center">{successMessage}</div>
                    )}
                   
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 border rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                       
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="w-full p-3 border rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500`}></i>
                                </button>
                            </div>
                        </div>
                       
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="mr-2"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <label htmlFor="remember-me">Remember me</label>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline"
                                    onClick={onForgotPassword}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                       
                        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                       
                        <button
                            type="submit"
                            className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                   
                    <div className="text-center mt-6">
                        Don't have an account? <button className="text-blue-600 hover:underline">Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;