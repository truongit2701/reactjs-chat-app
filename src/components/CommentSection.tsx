import moment from 'moment';
import React from 'react';

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
  }
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  comments: Comment[];
  newComment: string;
  onNewCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentSubmit: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, newComment, onNewCommentChange, onCommentSubmit }) => (
  <div className="mt-4">
    <ul className="space-y-2">
      {comments.map((comment, index) => (
        <div className='flex gap-2' key={index}>
          <div className='flex flex-col'>
          <li>{comment.user.username} </li>
            <p className='text-sm text-gray-400'>
            { moment(comment.created_at).fromNow() }
            </p>
          </div>
          <li className="bg-gray-100 w-full p-2">{comment.content}</li>
        </div>
      ))}
    </ul>
    <div className="mt-2 flex">
      <input
        type="text"
        value={newComment}
        onChange={onNewCommentChange}
        className="flex-grow border rounded-l px-2 py-1"
        placeholder="Add a comment..."
      />
      <button
        onClick={onCommentSubmit}
        className="bg-blue-500 text-white px-4 py-1 rounded-r"
      >
        Send
      </button>
    </div>
  </div>
);

export default CommentSection;
