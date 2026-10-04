import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import ChatMessage from '../components/ChatMessage';
import { mockChatMessages, mockRepositories } from '../services/mockData';
import { MessageSquareCode, Send, Sparkles, Bot, HelpCircle } from 'lucide-react';

const AIChatPage = () => {
  const { id } = useParams();
  const repo = mockRepositories.find((r) => r.id === id) || mockRepositories[0];

  const [messages, setMessages] = useState(mockChatMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const exampleQuestions = [
    "What does this project do?",
    "Explain the project architecture.",
    "Where is authentication implemented?",
    "What technologies are used?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (questionText) => {
    const textToSend = questionText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputText('');
    setIsTyping(true);

    // Simulated response for UI demonstration
    setTimeout(() => {
      let aiResponseText = `Regarding **${repo.fullName}**: The codebase is structured using modular components with clean abstraction layers. Ask any specific question regarding modules or dependencies!`;

      if (textToSend.includes('architecture')) {
        aiResponseText = `**${repo.fullName}** follows a Component-Driven Monorepo architecture with explicit domain isolation, fiber reconciliation, and synthetic DOM renderers.`;
      } else if (textToSend.includes('technologies')) {
        aiResponseText = `Primary technologies identified: **${repo.language}**, Jest for testing, Webpack/Rollup bundlers, and ESLint for static code analysis.`;
      } else if (textToSend.includes('authentication')) {
        aiResponseText = `This repository is a frontend UI core library; authentication logic is typically delegated to consumer app middleware or external OAuth providers.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                Repository AI Assistant
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
                  {repo.fullName}
                </span>
              </h1>
              <p className="text-xs text-slate-400">Context aware chat interface</p>
            </div>
          </div>
        </div>

        {/* Chat Body Window */}
        <Card className="flex-1 flex flex-col justify-between overflow-hidden p-4 sm:p-6 bg-slate-900/60 border border-slate-800">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse p-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant is analyzing codebase...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Example Prompt Shortcuts */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Suggested Questions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 pt-2"
            >
              <input
                type="text"
                placeholder={`Ask anything about ${repo.fullName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <Button type="submit" variant="primary" size="md" icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
