import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  username: string;
}

interface Conversation {
  id: string;
  name: string;
  participants: string[];
  nons: number
}

interface CreateConversationPopupProps {
  onClose: () => void;
}

const CreateConversationPopup: React.FC<CreateConversationPopupProps> = ({ onClose }) => {
  const [conversationName, setConversationName] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { authState } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/user');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversationName(e.target.value);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/conversation', {
        name: conversationName,
        participantIds: [...selectedUsers, authState.id],
      });
      
      // onCreateSuccess({
      //   ...response.data.data,
      //   nons: 0
      // });
      onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2 className='text-center text-xl bold'>Create New Conversation</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="conversationName">Conversation Name:</label>
            <input
              type="text"
              id="conversationName"
              className='input'
              value={conversationName}
              onChange={handleNameChange}
              required
            />
          </div>
          <div>
            <label>Select Participants:</label>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                    />
                    {" "}{user.username}
                  </label>
                </li>
              ))}
            </ul>
          </div>
                  <div className="flex justify-between mt-4">
                  <button
                      type="button"
                      onClick={onClose}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    >
                      Create Conversation
                    </button>
                  </div>
                </form>
              </div>
    </div>
  );
};

export default CreateConversationPopup;
