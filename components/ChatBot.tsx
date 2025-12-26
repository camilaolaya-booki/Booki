
import React, { useState, useRef, useEffect } from 'react';
import { getLibritoResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface ChatBotProps {
  currentContext: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ currentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! Soy Librito, tu compañero de aventuras. ¿Tienes alguna pregunta sobre lo que estás leyendo?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const botText = await getLibritoResponse(userText, currentContext);
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '¡Uy! Me quedé sin tinta. ¿Podrías preguntarme de nuevo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-[320px] md:w-[400px] h-[500px] rounded-3xl shadow-2xl flex flex-col border-4 border-orange-400 overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-orange-400 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <div>
                <h3 className="font-bold leading-none">Librito</h3>
                <span className="text-[10px] opacity-80">En línea</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-orange-500 rounded-full p-1">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-orange-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-orange-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-orange-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregúntale a Librito..."
              className="flex-1 px-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button 
              onClick={handleSend}
              className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              ➔
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white animate-float"
        >
          📖
        </button>
      )}
    </div>
  );
};

export default ChatBot;
