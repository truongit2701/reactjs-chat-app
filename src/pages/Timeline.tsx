import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import PostHeader from '../components/PostHeader';
import PostContent from '../components/PostContent';
import PostActions from '../components/PostActions';
import CommentSection from '../components/CommentSection';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

interface User{
  username: string,
  avatar: string
}

interface Post{
  id: number,
  image: string,
  content: string,
  user: User,
  like_total: number[],
  created_at: string,
  comments: any[]
}

interface Comment {
  user: User,
  content: string
}

const Timeline = () => {
   const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
   const [newComment, setNewComment] = useState<string>('');
   const [posts, setPosts] = useState<Post[]>([]);
   const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
   const [content, setContent] = useState<string>('');
   const [imagePost, setImagePost] = useState<File | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(false); 
   const [progress, setProgress] = useState<number>(0); // Add progress state
  
  const { authState } = useAuth();

   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const toggleComments = (postId: number) => {
     setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
   };

   const handleCommentSubmit = async (postId: number) => {
     if (newComment.trim() !== '') {
      await axiosInstance.post(`/comment`, { content: newComment, post_id: postId });
       setPosts(prevPosts => prevPosts.map(post => {
         if (post.id === postId) {
           return {
             ...post,
             comments: [...post.comments, { id: Math.random() * 1000, user: { username: authState.username, avatar: authState.avatar }, content: newComment, created_at: new Date().toISOString() }]
           };
         }
         return post;
       }));
       setNewComment('');
     }
   };

   const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
        setSuccess(response.data.message);
        setImagePost(response.data.url);
      }
    }
   } catch(err) {
      console.log("♥️ ~ handleImageChange ~ err:", err)
      setError(err.response?.data?.message || 'some thing went wrong');
   }
  };

   const handleNewPostSubmit = async () => {
    if (content.trim() !== '') {
       setLoading(true); // Start loading
       setProgress(0);

       const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);


      const response = await axiosInstance.post('post', { content, image: imagePost });
      console.log("♥️ ~ handleNewPostSubmit ~ response:", response)
      setContent('');

      if(response.data.status === 200){
        setSuccess('Create post successfully!');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => {
          fetchPosts(); // Fetch new posts after a delay
          setLoading(false); // Stop loading
        }, 1000);
      }
    }
  };

  const handLikePost = async (postId: number) => {
    const response = await axiosInstance.post(`post/${postId}/like`);
    setPosts(prevPosts => prevPosts.map(post => {
      console.log("♥️ ~ handLikePost ~ response:", response)
      if (post.id === postId) {
        return {
          ...post,
          like_total: response.data.data
        };
      }
      return post;
    }));
  };

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/post');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
   const ImagePopup = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="max-w-4xl max-h-4xl">
        <img src={imageUrl} alt="Enlarged" className="max-w-full max-h-full object-contain" />
      </div>
    </div>
  );
   
  return (
    <div className="flex items-center justify-center p-4 overflow-y-auto font-handwritten">
      <div className="flex flex-col w-full max-w-2xl gap-4">
      <div className="bg-white p-2 rounded-lg border-2 border-black">
          <h2 className="text-xl font-bold mb-2">Create a New Post</h2>
          <input
            type="text"
            className="input"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            className="w-[200px] p-2"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {success && (
            <div className="text-green-500 text-sm mt-2">{success}</div>
          )}
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
           <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleNewPostSubmit}
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-black h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

        {posts.map(post => (
          <div key={post.id} className="post-item">
            <PostHeader user={post.user} created_at={post.created_at} />
            <PostContent
              content={post.content}
              imageUrl={post.image}
              onImageClick={(url) => setEnlargedImage(url)}
            />
            <PostActions 
              likes={post?.like_total || []} 
              commentsCount={post.comments.length} 
              onToggleComments={() => toggleComments(post.id)}
              showComments={showComments[post.id]}
              userId={authState.id}
              handLikePost={() => handLikePost(post.id)}
            />
            {showComments[post.id] && (
              <CommentSection 
                comments={post.comments}
                newComment={newComment}
                onNewCommentChange={(e) => setNewComment(e.target.value)}
                onCommentSubmit={() => handleCommentSubmit(post.id)}
              />
            )}
          </div>
        ))}
      </div>
        {enlargedImage && (
        <ImagePopup imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />
      )}
    </div>
  );
};

export default Timeline;