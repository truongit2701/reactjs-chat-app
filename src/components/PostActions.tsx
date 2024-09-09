import React from 'react';
import { useAuth } from '../context/AuthContext';

interface PostActionsProps {
  likes: number[];
  commentsCount: number;
  userId: number;
  onToggleComments: () => void;
  handLikePost: () => void;
  showComments: boolean;
}


const PostActions: React.FC<PostActionsProps> = ({ likes, commentsCount, onToggleComments, showComments, userId, handLikePost }) => (
  <div className="flex items-center justify-between mt-2">
    <div className="flex space-x-4">
      <button className={`flex items-center space-x-1 ${likes.includes(userId) ? 'text-blue-500' : 'text-gray-500' } `} 
      onClick={handLikePost}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9l-6 6m0 0l6-6m-6 6V4"></path>
        </svg>
        <span>{likes.length} Likes</span>
      </button>
      <button 
        onClick={onToggleComments}
        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
      >
        <svg 
          className={`w-5 h-5 transition-transform ${showComments ? 'rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
        <span>{commentsCount} Comments</span>
      </button>
    </div>
  </div>
);

export default PostActions;
