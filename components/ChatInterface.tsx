import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithTutor } from '../services/geminiService';

interface ChatInterfaceProps {
  lessonTitle: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ lessonTitle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm your AI TA. Ask me anything about "${lessonTitle}"!`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when lesson changes
  useEffect(() => {
    setMessages([{ role: 'model', text: `Ready to help with "${lessonTitle}".`, timestamp: Date.now() }]);
  }, [lessonTitle]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await chatWithTutor(input, messages, lessonTitle);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border-l border-[#2d2d2d]">
      {/* Header */}
      <div className="p-4 border-b border-[#2d2d2d] flex items-center gap-2 bg-[#161616]">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold text-gray-200 text-sm uppercase tracking-wider">Gemini Live Tutor</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-rose-600' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-rose-600/10 text-rose-100 border border-rose-500/20' 
                : 'bg-[#1f1f1f] text-gray-300 border border-[#2d2d2d]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
               <Bot size={14} />
             </div>
             <div className="bg-[#1f1f1f] p-3 rounded-2xl flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-indigo-400" />
               <span className="text-xs text-gray-500">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#2d2d2d] bg-[#161616]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about the video..."
            className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};