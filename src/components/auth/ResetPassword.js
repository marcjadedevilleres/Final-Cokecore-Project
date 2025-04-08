import React, { useState } from 'react';
import Logo from '../shared/Logo';

const ResetPassword = ({ onBack, onSubmit, email }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate passwords
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        
        try {
            // In a real app, you would call an API here
            // For example: await api.resetPassword(token, password);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            onSubmit();
        } catch (error) {
            setError('An error occurred while resetting your password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-light-blue-100 items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded border border-blue-300 p-8 shadow-md">
                    <Logo />
                    <h2 className="text-center text-xl font-semibold mb-4">Reset Your Password</h2>
                    <p className="text-center text-gray-600 mb-6">
                        Create a new password for {email}
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
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
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirmPassword" 
                                    className="w-full p-3 border rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        
                        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                        
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50 transition-colors"
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;