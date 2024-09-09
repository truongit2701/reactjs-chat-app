// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
   const { authState, logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/auth/login');
   };

  return (
    <header className="bg-white border-b-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.8)] mb-6 font-handwritten">
      <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
        {/* Logo or Title */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-yellow-600 transition-colors duration-300">
            MyApp
          </Link>
        </div>
        {/* Navigation Links */}
        <nav className="flex space-x-4 items-center">
         {
            authState.isAuthenticated ? (
             <>
             <Link to="/" className="header-link">
                  Confession
               </Link>

               <Link to="/chat" className="header-link">
                  Chat
               </Link>
                  <div className="relative group border-b-2 border-black p-1 rounded-xl">
                  <div className="flex items-center space-x-2 cursor-pointer">
                  <img
                     src={`http://103.75.183.248:3000${authState?.avatar}` || '/default-avatar.png'}
                     alt="User Avatar"
                     className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{authState?.username || 'User'}</span>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                     <button  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                       <Link to="/profile">
                        Profile
                       </Link>
                     </button>
                     <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                     </button>
                  </div>
               </div>
               
            </>
            ) : (
               <>
                <Link
                     to="auth/register"
                     className="header-link"
                  >
                     Register
                  </Link>
                  <Link
                     to="auth/login"
                     className="header-link"
                  >
                     Login
                  </Link>
                  </>
            )
         }
         
        </nav>
      </div>
    </header>
  );
};

export default Header;
