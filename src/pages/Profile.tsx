import React, { ChangeEvent, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosInstance';

const Profile = () => {
   const { authState, updateAvatar } = useAuth();
   const [error, setError] = React.useState<string | null>(null);
   const [success, setSuccess] = React.useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [avatar, setAvatar] = React.useState<string | null>(null);

   useEffect(() => {
    if(authState.avatar){
      setAvatar(authState.avatar);
    }
   }, [authState.avatar]);

   
   const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
     if (e.target.files && e.target.files.length > 0) {
       const formData = new FormData();
       formData.append('file', e.target.files[0]);
       
       const response = await axiosInstance.post('upload/file', formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
         },
       });

       if(response.status === 201){
         await axiosInstance.post(`/user/${authState.id}/update-avatar`, { avatar: response.data.url });
       }

       updateAvatar(response.data.url);
       setSuccess('Avatar updated successfully!');
       if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

     }
    } catch(err) {
       console.log("♥️ ~ handleImageChange ~ err:", err)
       setError(err.response?.data?.message || 'some thing went wrong');
    }
   };

  return (
   <div className="flex items-center justify-center p-8 font-handwritten">
   <div className="flex flex-col p-4 rounded-xl border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,0.8)] ">
     {/* Avatar Section */}
     <div className="relative flex flex-col items-center gap-4">
       <img
         src={`http://103.75.183.248:3000${avatar ? avatar : authState.avatar}` || "/default-avatar.png"}
         alt="Avatar"
         className="w-32 h-32 rounded-full border-2 border-black object-cover "
       />
       <input
         type="file"
         className="input"
         ref={fileInputRef}
         onChange={handleAvatarChange}
       />
       {error && (
         <div className="text-red-500 text-sm mt-2">{error}</div>
       )}
       {success && (
         <div className="text-green-500 text-sm mt-2">{success}</div>
       )}
     </div>
 
     {/* Username Section */}
     <div className="mt-6 w-full">
       <label className="block text-gray-700 text-lg font-bold mb-2">
         Username
       </label>
       <input
         type="text"
         className="input cursor-not-allowed"
         value={authState.username}
         disabled
       />
     </div> 
 
     {/* Button Section */}
     {/* <div className="mt-6 flex w-full">
       <button
         className="btn"
         onClick={handleProfileUpdate}
       >
         Update Profile
       </button>
     </div> */}
   </div>
 </div>
 
  )
}

export default Profile