
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export const Chatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  
  return (
    <>
      {/* Chatbot toggle button */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-8 right-8 bg-vaccine-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Toggle chatbot</span>
      </button>
      
      {/* Simple chatbot UI */}
      {showChatbot && (
        <div className="fixed bottom-24 right-8 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border">
          <div className="bg-vaccine-blue text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">VacciBot Assistant</span>
            </div>
            <button onClick={() => setShowChatbot(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p>Hello! I'm VacciBot, your vaccination assistant. How can I help you today?</p>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-vaccine-blue text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
                  <p>What vaccines are due for my child?</p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <p>Based on your child Emma's age (3 years), the upcoming vaccines recommended are:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Influenza (annual flu shot)</li>
                  <li>DTaP booster (4-6 years)</li>
                </ul>
                <p className="mt-2">Would you like to schedule an appointment for these vaccines?</p>
              </div>
            </div>
          </div>
          <div className="border-t p-3 flex gap-2">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button size="sm">Send</Button>
          </div>
        </div>
      )}
    </>
  );
};
