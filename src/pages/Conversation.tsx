// src/pages/Conversation.tsx
import React, { useState, useEffect } from 'react';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import axiosInstance from '../axiosInstance';
import ConversationHeader from '../components/ConversationHeader';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import CreateConversationPopup from '../components/CreateConversationPopup';
import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  name: string;
  content: string;
  created_at: string;
  nons: number
}

export interface MessageType {
  id: string;
  content: string;
  user: any;
  createdAt: string;
  conversationId: string;
}

interface CustomResponse<T> {
  data: T;
}

const Conversation: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const {authState} = useAuth()

  const handleAddNew = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get<CustomResponse<Conversation[]>>('/conversation');
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {

      const response = await axiosInstance.get<CustomResponse<MessageType[]>>(`/message?conver_id=${conversationId}`);
      setMessages(response.data.data);
      console.log("♥️ ~ fetchMessages ~ response:", response)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
    socket.emit('join-room', { roomId: conversationId });

    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, nons: 0 }
          : conv
      )
    );

  };

  const handleSendMessage = (content: string) => {
    if (content.trim() === '' || !selectedConversation) return;

    socket.emit('msg-text', {
      content,
      conversationId: selectedConversation
    });
  };

  useEffect(() => {
    socket.on('msg-text', (data) => {
      console.log("♥️ ~ ----- message text", data)
      if(data.converId === selectedConversation) {
        setMessages(prevMessages => [...prevMessages, data]);
      }

      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === data.converId
            ? { 
                ...conv, 
                content: data.content,
                nons: conv.id === selectedConversation ? 0 : (conv.nons || 0) + 1,
              }
            : conv
        )
      );
    });

    socket.on('create-conversation', (newConversation) => {
      console.log("♥️ ------ create conver ", newConversation)
      if(newConversation.participantIds.includes(authState.id)){
        setConversations(prevConversations => [
          {
            id: newConversation.id,
            name: newConversation.name,
            content: '',
            created_at: new Date().toISOString(),
            nons: 0,
          },
          ...prevConversations
        ]);
      }
    });

    return () => {
      socket.off('msg-text');
      socket.off('create-conversation');
    };
  }, [socket, selectedConversation]);

  return (
    <div className="flex items-center justify-center h-screen font-handwritten">
      <div className="flex w-full max-w-4xl h-[600px] border-4 border-black shadow-[6px_6px_0_rgba(0,0,0,0.8)] relative">
        <button 
            onClick={handleAddNew}
            className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
          Add New
        </button>
        <ConversationList 
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
        <div className="w-2/3 bg-white p-4 flex flex-col">
          {selectedConversation ? (
            <>
              <ConversationHeader conversation={conversations.find(c => c.id === selectedConversation)} />
              <MessageList messages={messages} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
      {showPopup && (
        <CreateConversationPopup
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};
export default Conversation;
