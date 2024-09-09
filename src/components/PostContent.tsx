import React from 'react';

const PostContent = ({ content, imageUrl, onImageClick }: { content: string; imageUrl?: string; onImageClick: (url: string) => void }) => (
  <>
    <div className="mb-4">
      <p className="text-gray-800">{content}</p>
    </div>
     {imageUrl && (
      <img
        src={`http://103.75.183.248:3000${imageUrl}`}
        alt="Post"
        className="mt-2 w-full h-auto rounded-lg cursor-pointer"
        onClick={() => onImageClick(imageUrl)}
      />
    )}
  </>
);

export default PostContent;
