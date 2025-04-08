import React, { useState } from 'react';

const ForgotPassword = ({ onBack, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // This would be an API call in a real application
            setTimeout(() => {
                onSubmit(email);
                setLoading(false);
            }, 1000);
        } catch (error) {
            setError(error.message || 'Failed to send recovery email');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded border border-gray-300 p-8 shadow-md">
                    <div className="mb-6">
                        <button onClick={onBack} className="text-3xl">&larr;</button>
                    </div>
                    
                    <h2 className="text-center text-xl font-semibold mb-6">
                        To regain access to your account, please enter your Email Address.
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="reset-email" className="block text-gray-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="reset-email" 
                                className="w-full p-3 border rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                        
                        <button 
                            type="submit" 
                            className="w-full py-3 bg-gray-800 text-white rounded font-semibold hover:bg-gray-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    
                    <div className="text-center mt-8">
                        <button 
                            className="text-black hover:underline"
                            onClick={onBack}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;