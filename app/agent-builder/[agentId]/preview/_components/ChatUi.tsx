"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Send, User, Bot, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatUiProps {
  agentToolConfig: any;
  GenerateAgentToolConfig: () => void;
  loading: boolean;
  conversationId: string | null;
}

function ChatUi({ agentToolConfig, GenerateAgentToolConfig, loading, conversationId }: ChatUiProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Trigger config generation if it doesn't exist on mount
  useEffect(() => {
    if (!agentToolConfig) {
      GenerateAgentToolConfig();
    }
  }, [agentToolConfig, GenerateAgentToolConfig]);

  // 2. Set initial greeting
  useEffect(() => {
    if (agentToolConfig && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: `Hello! I am ${agentToolConfig?.primaryAgentName || 'your AI Agent'}. How can I help?` 
        }
      ]);
    }
  }, [agentToolConfig, messages.length]);

  // 3. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userMsg,
          agents: agentToolConfig.agents,
          tools: agentToolConfig.tools,
          agentName: agentToolConfig.primaryAgentName,
          conversationId: conversationId
        })
      });

      if (!response.body) throw new Error("No response body");

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex].content += chunk;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Streaming Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
      <p className="text-sm font-medium">Initializing Brain...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-slate-50 border rounded-tl-none'
              }`}>
                {msg.content || <Loader2 size={14} className="animate-spin" />}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your agent..."
            className="flex-1 h-10 text-sm"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="rounded-full h-10 w-10">
            {isTyping ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChatUi;