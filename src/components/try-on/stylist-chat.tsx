'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function StylistChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "WELCOME TO THE PHASION SENSE ATELIER. I AM YOUR PRIVATE AI STYLIST. DISCUSS FITTING SIZES, EMERGENCE ANKARA EMBROIDERY PATTERNS, OR KENTE TEXTURE HARMONIZATION DIRECTIONS FOR YOUR BESPOKE LOOK."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window when new elements arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const openRouterKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
      const openRouterModel = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: openRouterModel,
          messages: [
            {
              role: 'system',
              content: "You are the Phasion Sense AI Stylist, an elite contemporary African fashion design expert and stylist. You are advising a high-end customer at the 'Amina Stitches' studio. Keep your tone sophisticated, minimalist, refined, and luxury-oriented. Answer with short, clean, structured paragraphs. Avoid raw code or tech jargon—focus exclusively on high fashion styling, fabric choices (like Ankara and Kente coordinates), sizing, and bespoke design ideas."
            },
            ...messages.filter((m) => m.role !== 'system'),
            userMessage
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Phasion Sense Studio'
          }
        }
      );

      const botReply = response.data.choices[0]?.message?.content || "Apologies, the styling connection was temporarily interrupted. Please prompt again.";
      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      console.error('OpenRouter API request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "THE ATELIER WIRELESS UPLINK EXPERIENCED A TRANSIENT CONGESTION FAULT. PLEASE INITIATE THE PROMPT SEQUENCE AGAIN."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#16161e] border border-[#1c1c24] p-8 text-[#f4f4f5] font-mono text-[10px] shadow-2xl flex flex-col h-[400px]">
      {/* Panel Header */}
      <div className="border-b border-[#272730] pb-5 mb-5 flex justify-between items-center flex-shrink-0">
        <div className="flex flex-col space-y-1">
          <h3 className="font-sans text-base font-light tracking-[0.15em] uppercase">
            AI Stylist Assistant
          </h3>
          <span className="font-mono text-[8px] text-[#71717a] tracking-widest uppercase">
            Nvidia Nemotron // Reasoning Stitches
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-[#d4af37]">Stylist Active</span>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar flex flex-col mb-4">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <span className="font-mono text-[8px] text-[#71717a] tracking-widest uppercase mb-1">
              {m.role === 'user' ? 'Client' : 'Stylist'}
            </span>
            <div 
              className={`p-4 rounded-sm border leading-relaxed uppercase tracking-wider text-[9px] ${
                m.role === 'user' 
                  ? 'bg-transparent border-[#d4af37]/35 text-[#d4af37]' 
                  : 'bg-[#09090b]/80 border-[#1c1c24] text-[#a1a1aa]'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        
        {/* Loading Spinner Dots */}
        {isLoading && (
          <div className="self-start flex flex-col items-start max-w-[85%] animate-pulse">
            <span className="font-mono text-[8px] text-[#71717a] tracking-widest uppercase mb-1">Stylist</span>
            <div className="p-4 rounded-sm border bg-[#09090b]/80 border-[#1c1c24] text-[#a1a1aa] flex space-x-1.5 items-center">
              <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-bounce" />
              <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Input Area */}
      <form onSubmit={handleSendMessage} className="flex space-x-3 mt-auto flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="ASK STYLIST ABOUT Sleeve styles, Kente matching..."
          className="flex-1 bg-[#09090b] border border-[#272730] focus:border-[#d4af37] p-3.5 text-[9px] text-[#f4f4f5] outline-none transition-all duration-300 rounded-sm placeholder-[#3f3f46] uppercase font-mono tracking-widest"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 bg-[#f4f4f5] text-[#09090b] border border-transparent font-sans text-[10px] font-bold tracking-widest uppercase hover:bg-[#d4af37] transition-all duration-300 disabled:opacity-20 disabled:hover:bg-[#f4f4f5] disabled:hover:text-[#09090b]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
