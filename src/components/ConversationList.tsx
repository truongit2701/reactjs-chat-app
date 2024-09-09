import React from 'react';
import { Conversation } from '../pages/Conversation';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedConversation, onSelectConversation }) => {
  return (
    <div className="w-1/3 bg-white p-4 border-r-4 border-black overflow-y-auto">
      <h2 className="text-xl mb-4">Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            className={`mb-2 p-2 border-2 border-black rounded-lg cursor-pointer 
              ${selectedConversation === conversation.id ? 'bg-yellow-50' : 'bg-white'} 
              hover:bg-yellow-50 transition-all duration-200 relative`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <h3>{conversation.name}</h3>
            <div className="flex text-sm text-gray-600 items-center justify-between">
              <p className="">{conversation.content} </p>
              {/* <p>{conversation.created_at ? moment(conversation.created_at).add(7, 'hours').format('HH:mm') : ''}</p> */}
            </div>
            {conversation.nons > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {conversation.nons}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ConversationList;
