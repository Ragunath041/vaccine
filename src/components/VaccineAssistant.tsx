import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  MessageSquare, 
  ChevronDown, 
  X,
  Bot 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Predefined chat responses
const PREDEFINED_RESPONSES = {
  "hello": "Hello! How can I help you with your vaccination needs today?",
  "hi": "Hi there! I'm your vaccination assistant. What questions do you have?",
  "vaccines": "We offer a full range of vaccines for children including DTaP, MMR, Polio, Hepatitis, and more. These are administered according to the recommended schedule.",
  "appointment": "You can book an appointment through the dashboard. Click on 'Book Appointment' and select a doctor, date, and time that works for you.",
  "side effects": "Common side effects include mild fever, soreness at injection site, and slight irritability. These typically resolve within 1-2 days. If you notice severe symptoms, please contact your doctor immediately.",
  "records": "Your child's vaccination records are available in the 'Records' section. You can view or download them at any time.",
  "schedule": "The vaccination schedule follows guidelines set by health authorities. The timeline varies by vaccine, with some requiring multiple doses at specific intervals.",
  "reminder": "We send automatic reminders for upcoming vaccinations. You can also set custom reminders in the 'Notifications' section.",
  "doctor": "Our doctors are all certified pediatricians with specialization in immunization. You can see their profiles in the 'Doctors' section.",
  "help": "I can help with information about vaccines, appointments, records, or side effects. What would you like to know?"
};

// Default suggestions to help users
const SUGGESTIONS = [
  "What vaccines do you offer?",
  "How do I book an appointment?",
  "What are common side effects?",
  "How can I view vaccination records?",
  "What is the vaccination schedule?"
];

type Message = {
  id: number;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

export function VaccineAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your VacciCare assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process user input and generate response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: generateResponse(input),
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 500);
    
    setInput("");
  };

  const generateResponse = (userInput: string): string => {
    const inputLower = userInput.toLowerCase();
    
    // Check for keyword matches in predefined responses
    for (const [keyword, response] of Object.entries(PREDEFINED_RESPONSES)) {
      if (inputLower.includes(keyword)) {
        return response;
      }
    }
    
    // Default response if no keywords match
    return "I'm not sure about that. Would you like to know about vaccines, appointments, or vaccination records?";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    
    // Wait for state to update, then send
    setTimeout(() => {
      const userMessage: Message = {
        id: messages.length + 1,
        text: suggestion,
        sender: "user",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: generateResponse(suggestion),
          sender: "assistant",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      }, 500);
      
      setInput("");
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-14 w-14 shadow-lg"
        variant={isOpen ? "secondary" : "default"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
          {/* Chat header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-blue-100">
                <AvatarImage src="/chatbot-avatar.png" alt="Chatbot" />
                <AvatarFallback className="bg-vaccine-blue text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">VacciCare Assistant</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-3 h-80">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-vaccine-blue text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Chat input */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              size="sm"
              className="h-8 w-8 p-0"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 