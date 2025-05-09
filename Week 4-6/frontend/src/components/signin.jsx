import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(
        'http://localhost:3000/login',
        { email, password },
        { withCredentials: true }  // for cookie/session-based login
      );
      if(res.data.isAdmin){
        navigate('/add-product');
      }else{
      navigate('/loginVerify'); // Redirect to homepage after successful login
      }
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          
          <div className="flex flex-col">
            <label className="mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="p-2 rounded bg-white text-black"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-2 rounded bg-white text-black"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 p-2 rounded font-bold cursor-pointer"
          >
            Login
          </button>

          <div className="text-center mt-4 text-sm">
            Not a member?{' '}
            <a href="/signup" className="text-green-400 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
