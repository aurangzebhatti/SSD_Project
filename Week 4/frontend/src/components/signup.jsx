import React, { use } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const Signup = () => {

  const navigate = useNavigate();

  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(
        'http://localhost:3000/signup',
        { name, email, password },
        { withCredentials: true }
      );
  
      if(res.data.exitsEmail){
      alert(res.data.message); // Should say "Verification code sent"
      }else{
      navigate('/verify');
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4" >
          
          <div className="flex flex-col">
            <label className="mb-1">Name</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              required
              className="p-2 rounded bg-white text-black"
            />
          </div>

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

          <div className="flex items-center space-x-2">
            <input type="checkbox" className="accent-green-500" />
            <label className="text-sm">
              I agree to Privacy Policy and Terms & Conditions.
            </label>
          </div>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 p-2 rounded font-bold cursor-pointer"
          >
            Register
          </button>

          <div className="text-center mt-4 text-sm">
            Already a member?{' '}
            <a href="/signin" className="text-green-400 hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
