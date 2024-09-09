// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
   const { login } = useAuth();

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState<string | null>(null);

   const navigate = useNavigate();

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (password === "" || username === "") {
         setError("Please fill in all fields");
         return;
      }

      try {
         
         const response = await axiosInstance.post('auth/login', {
            username,
            password
         });
         const { access_token } = response.data;

         login(access_token, '', response.data.username, response.data.avatar, response.data.id); 

         setError(null); 
         setUsername("");
         setPassword("");

         navigate('/');
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred during registration');
      }
    };

    return (
      <div className="flex items-center justify-center h-screen font-handwritten">
         <div className="p-8 max-w-md mx-auto bg-white border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,0.8)]">
         <h1 className="text-center text-2xl text-black mb-4">Login</h1>
         {error && <p className="text-red-500 mb-4">{error}</p>}
         <form onSubmit={handleSubmit} className="w-[300px]">
            <div className="mb-2">
               <label className="block mb-1" htmlFor="input1">username:</label>
               <input type="text" id="input1" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter text..." />
            </div>
            <div className="mb-2">
               <label className="block mb-1" htmlFor="input2">password:</label>
               <input type="password" id="input2" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter text..." />
            </div>
            <button type="submit" className="btn">
               Submit
            </button>
         </form>
      </div>
      </div>
  );
};

export default Login;
