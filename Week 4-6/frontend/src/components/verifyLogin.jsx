import React, { useState } from 'react';
import axios from 'axios';

const VerifyLogin = () => {
  const [code, setCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(
        'http://localhost:3000/loginVerify',
        { code },
        { withCredentials: true }
      );
  
      if (res.data.valid) {
        // Redirect to home only if verification succeeded
        window.location.href = '/home';
      } else {
        alert('Invalid verification code');
      }
    } catch (err) {
      console.error(err);
      alert('Verification failed. Please check the code.');
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Verify Email</h2>
        <form onSubmit={handleVerify} className="flex flex-col space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
            className="p-2 rounded bg-white text-black"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 p-2 rounded font-bold cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyLogin;
