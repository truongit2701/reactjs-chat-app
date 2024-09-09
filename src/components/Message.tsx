import React from 'react';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

interface MessageProps {
  message: {
   id: string;
   content: string;
   user: any;
   createdAt: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
   const { authState } = useAuth();
   const isCurrentUser = message.user.username === authState.username;
 
   return (
     <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
       {!isCurrentUser && (
         <img src={message.user.avatar || '/default-avatar.png'} alt={message.user.username} className="w-8 h-8 rounded-full mr-2" />
       )}
       <div className={`max-w-[70%] rounded-lg p-3 ${
         isCurrentUser 
           ? 'bg-blue-500 text-white rounded-br-none' 
           : 'bg-gray-200 text-gray-800 rounded-bl-none'
       }`}>
         {!isCurrentUser && <p className="font-bold text-sm mb-1">{message.user.username}</p>}
         <p>{message.content}</p>
         <span className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'} block mt-1`}>
         {moment(message.createdAt).format('DD/MM/YYYY HH:mm')}
         </span>
       </div>
     </div>
   );
 };

export default Message;
