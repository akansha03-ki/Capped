"use client";

import { MessageCircle, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, transactions } = useGlobalContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          profile,
          recentTransactions: transactions.slice(0, 5)
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get response");
      }
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let aiContent = "";
      const aiMessageId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: aiMessageId, role: "assistant", content: "" }]);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiContent += decoder.decode(value);
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content: aiContent } : m));
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: `Error: ${err.message || "Please check your API key or try again."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[340px] h-[450px] bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[var(--p1)] text-white p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-lg">Capped Advisor</span>
              <span className="text-xs opacity-80">Sarcastic but helpful</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-10">
                <p>Go ahead, yap about your money.</p>
                <p className="opacity-70 mt-1">I'm ready to judge.</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-[var(--p2)] text-white rounded-br-sm' 
                    : 'bg-gray-100 dark:bg-[#2a2a2a] text-[var(--fg)] rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-gray-100 dark:bg-[#2a2a2a] text-[var(--fg)] rounded-bl-sm flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex gap-2">
            <input 
              value={input}
              onChange={handleInputChange}
              placeholder="Ask for advice..."
              className="flex-1 bg-gray-50 dark:bg-[#2a2a2a] border border-transparent focus:border-[var(--p1)] focus:outline-none rounded-xl px-4 py-2 text-sm text-[var(--fg)]"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-[var(--p1)] text-white p-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : 'bg-[var(--p3)] text-gray-900'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
