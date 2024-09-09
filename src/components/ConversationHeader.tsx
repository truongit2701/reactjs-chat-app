import React from 'react';
import { Conversation } from '../pages/Conversation';

interface ConversationHeaderProps {
  conversation: Conversation | undefined;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  if (!conversation) return null;

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{conversation.name}</h2>
    </div>
  );
};

export default ConversationHeader;
