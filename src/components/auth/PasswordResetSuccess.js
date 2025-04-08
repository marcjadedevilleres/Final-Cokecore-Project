import React from 'react';

const PasswordResetSuccess = ({ onBackToLogin }) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded border border-gray-300 p-8 shadow-md flex flex-col items-center">
          {/* Check mark icon */}
          <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mb-8">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          {/* Success message */}
          <h2 className="text-center text-3xl font-bold mb-12">
            Password has been
            <br />
            successfully changed!
          </h2>
          
          {/* Back to login button */}
          <button 
            onClick={onBackToLogin}
            className="w-full py-4 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;