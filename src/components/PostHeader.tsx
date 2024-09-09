import React from 'react';

interface PostHeaderProps {
  user: {
    avatar: string;
    username: string;
  };
  created_at: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ user, created_at }) => (
  <div className="flex items-center space-x-4 mb-4">
    <img 
      src={`http://103.75.183.248:3000${user.avatar}`} 
      alt="User avatar" 
      className="w-12 h-12 rounded-full"
    />
    <div>
      <h2 className="font-bold text-lg text-gray-800">{user.username}</h2>
      <p className="text-gray-500 text-sm">{new Date(created_at).toLocaleString()}</p>
    </div>
  </div>
);

export default PostHeader;
