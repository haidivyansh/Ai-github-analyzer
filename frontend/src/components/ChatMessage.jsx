import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAI && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-cyan-500/20">
          <Bot className="w-4 h-4" />
        </div>
      )}
      
      <div className={`max-w-xl rounded-2xl p-4 text-sm ${
        isAI 
          ? 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-tl-sm' 
          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md shadow-cyan-600/20'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <span className={`block text-[10px] mt-2 text-right ${isAI ? 'text-slate-400' : 'text-cyan-200'}`}>
          {message.timestamp}
        </span>
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
