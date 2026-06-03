'use client';

import { useState, useRef, useEffect } from 'react';
import { Leaf, Sparkles, Send, X, Bot, Zap, Info } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function EcoChat() {
  const { events, isChatOpen, toggleChat } = useStore();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string, isEco?: boolean}[]>([
    { 
      role: 'ai', 
      text: "Hello! I am Picko, your Eco-friendly AI Assistant. I have full access to all events on this platform. How can I help you today?",
      isEco: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerQuery = userMsg.toLowerCase();
      let responseText = "I couldn't find an exact match, but feel free to explore the Discoveries page to see everything we offer!";
      
      // Simple mock AI logic finding events
      const foundEvents = events.filter(e => 
        lowerQuery.includes(e.category.toLowerCase()) || 
        lowerQuery.includes(e.wilaya.toLowerCase()) || 
        lowerQuery.includes(e.city.toLowerCase()) ||
        lowerQuery.includes('event') ||
        lowerQuery.includes('all')
      );

      if (lowerQuery.includes('what') && lowerQuery.includes('events')) {
        responseText = `I have access to ${events.length} events right now! For example: "${events[0]?.title}" in ${events[0]?.wilaya}, and "${events[1]?.title}" in ${events[1]?.wilaya}.`;
      } else if (foundEvents.length > 0) {
        responseText = `I found something for you! Check out "${foundEvents[0].title}" happening in ${foundEvents[0].wilaya}. ${foundEvents[0].isFree ? "It's completely free!" : ""}`;
      } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        responseText = "Hello there! I'm Picko. I can search through all the events on this platform. What are you interested in?";
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: responseText,
        isEco: true 
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 glass-light border border-[var(--color-green)]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-[var(--color-mantle)] p-4 border-b border-[var(--color-surface-0)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-green)]/20 rounded-xl text-[var(--color-green)]">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Picko Eco-AI</h3>
              <p className="text-[10px] text-[var(--color-subtext-0)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-[var(--color-subtext-0)] hover:text-[var(--color-text)] transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Eco Notice */}
        <div className="bg-[var(--color-green)]/10 p-2 px-4 flex items-start gap-2 text-[11px] text-[var(--color-green)] border-b border-[var(--color-green)]/20">
          <Info size={14} className="shrink-0 mt-0.5" />
          <p>
            <strong>Green Mode Active:</strong> This assistant uses smart caching to reduce server CO2 emissions. <br/>
            Energy saved: ~12g CO2/request.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-lavender)] text-[var(--color-base)] rounded-tr-sm' 
                    : 'bg-[var(--color-surface-0)] text-[var(--color-text)] rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.isEco && (
                <div className="flex items-center gap-1 mt-1 text-[9px] text-[var(--color-green)] opacity-80">
                  <Zap size={10} />
                  <span>Cache Hit (0g CO2)</span>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-[var(--color-surface-0)] p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-subtext-0)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-subtext-0)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-subtext-0)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[var(--color-surface-0)] bg-[var(--color-base)]">
          <div className="flex items-center gap-2 bg-[var(--color-surface-0)] p-1.5 rounded-full border border-[var(--color-surface-1)] focus-within:border-[var(--color-lavender)] transition-colors">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask Picko anything..." 
              className="flex-1 bg-transparent border-none outline-none text-sm px-3 placeholder:text-[var(--color-subtext-0)]"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-[var(--color-lavender)] text-[var(--color-base)] rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
