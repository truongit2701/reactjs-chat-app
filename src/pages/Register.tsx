// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const Register: React.FC = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPass, setConfirmPass] = useState('');
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

   const navigate = useNavigate();

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (password === "" || confirmPass === "" || username === "") {
         setSuccess(null); 
         setError("Please fill in all fields");
         return;
      }

      if(password !== confirmPass) {
         setSuccess(null); 
         setError("Password and Confirm Password do not match");
         return;
      }

      try {
         
         await axiosInstance.post('auth/register', {
            username,
            password
         });

         setSuccess("Registration successfully! Click here to login.");
         setError(null); 
         setUsername("");
         setPassword("");
         setConfirmPass("");

      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred during registration');
        setSuccess(null); 
      }
    };

    const handleRedirect = () => {
      navigate('/auth/login');
    };


    return (
      <div className="flex items-center justify-center h-screen font-handwritten">
         <div className="p-8 max-w-md mx-auto bg-white border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,0.8)]">
         <h1 className="text-center text-2xl text-black mb-4">Register</h1>
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
            <div className="mb-2">
               <label className="block mb-1" htmlFor="input2">confirm password:</label>
               <input type="password" id="input3" className="input" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Enter text..." />
            </div>
            <button type="submit" className="w-full mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-300 shadow-[4px_4px_0_rgba(0,0,0,0.8)]">
               Submit
            </button>
         </form>
         {success && <div className="text-green-500 mt-1 text-center cursor-pointer" onClick={handleRedirect}>{success}</div>}
      </div>
      </div>
  );
};

export default Register;
