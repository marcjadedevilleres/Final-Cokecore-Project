import React, { useState, useRef, useEffect, useCallback } from 'react';


const VerificationCode = ({ onBack, onSubmit, onResend }) => {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
   
    // Create refs for each input field
    const inputRefs = useRef([]);
   
    // Initialize the refs array with useCallback to avoid dependency warnings
    const initializeRefs = useCallback(() => {
        // Ensure we have exactly 6 refs
        inputRefs.current = Array(6).fill(null).map((_, i) =>
            inputRefs.current[i] || React.createRef()
        );
       
        // Focus on the first input when component mounts
        if (inputRefs.current[0] && inputRefs.current[0].current) {
            inputRefs.current[0].current.focus();
        }
    }, []);
   
    // Call the initialization function once on mount
    useEffect(() => {
        initializeRefs();
    }, [initializeRefs]);
   
    // Handle verification code input
    const handleVerificationCodeChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d+$/.test(value)) return;
       
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
       
        // Auto-focus next input
        if (value && index < 5 && inputRefs.current[index + 1] && inputRefs.current[index + 1].current) {
            inputRefs.current[index + 1].current.focus();
        }
    };
   
    // Handle key press for navigation between inputs
    const handleKeyDown = (index, e) => {
        // Navigate to previous input on backspace
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0 &&
            inputRefs.current[index - 1] && inputRefs.current[index - 1].current) {
            inputRefs.current[index - 1].current.focus();
        }
    };
   
    // Handle paste functionality for the verification code
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
       
        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setVerificationCode(digits);
           
            // Focus the last input
            if (inputRefs.current[5] && inputRefs.current[5].current) {
                inputRefs.current[5].current.focus();
            }
        }
    };
   
    // Handle verification code submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
       
        // Validate code
        const code = verificationCode.join('');
        if (code.length !== 6) {
            setError('Please enter the complete verification code');
            setLoading(false);
            return;
        }
       
        try {
            // In a real app, you'd send the code to your backend
            await onSubmit(code);
        } catch (error) {
            setError(error.message || 'Failed to verify code');
            setLoading(false);
        }
    };
   
    // Handle resend code
    const handleResend = async () => {
        try {
            await onResend();
            // Clear existing inputs and focus on the first one
            setVerificationCode(['', '', '', '', '', '']);
            if (inputRefs.current[0] && inputRefs.current[0].current) {
                inputRefs.current[0].current.focus();
            }
        } catch (error) {
            setError(error.message || 'Failed to resend code');
        }
    };
   
    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded border border-gray-300 p-8 shadow-md">
                    <div className="mb-6">
                        <button
                            onClick={onBack}
                            className="text-3xl focus:outline-none"
                            aria-label="Go back"
                        >
                            &larr;
                        </button>
                    </div>
                   
                    <h2 className="text-center text-xl font-semibold mb-10">
                        We have sent a verification code to your email, to reset your password please enter the code below.
                    </h2>
                   
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between mb-6">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs.current[index]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    className="w-12 h-12 text-center text-xl border-b-2 border-gray-800 focus:outline-none focus:border-blue-500 bg-transparent"
                                    value={digit}
                                    onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : null}
                                    aria-label={`Digit ${index + 1} of verification code`}
                                />
                            ))}
                        </div>
                       
                        <div className="text-center mb-8">
                            <span>Didn't receive the code? </span>
                            <button
                                type="button"
                                className="text-black font-bold hover:underline focus:outline-none"
                                onClick={handleResend}
                            >
                                Resend
                            </button>
                        </div>
                       
                        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                       
                        <button
                            type="submit"
                            className="w-full py-3 bg-gray-800 text-white rounded font-semibold hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            disabled={loading || verificationCode.some(digit => !digit)}
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default VerificationCode;


