import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Vaccination guide content
const vaccinationGuideContent = {
  introduction: "Child vaccination is one of the most effective ways to protect children from life-threatening diseases. Vaccines help strengthen a child's immune system, preventing infections and complications.",
  
  importance: [
    "Protecting children from serious diseases like measles, polio, and hepatitis.",
    "Reducing the spread of infectious diseases in the community.",
    "Preventing complications that can lead to hospitalization or death.",
    "Strengthening immunity for long-term health benefits."
  ],
  
  schedule: {
    birth: ["BCG Vaccine: Protects against tuberculosis.", "Hepatitis B Vaccine (1st dose): Prevents liver infections caused by the Hepatitis B virus."],
    sixWeeks: ["DTP (Diphtheria, Tetanus, Pertussis) – 1st dose", "Hepatitis B (2nd dose)", "Hib (Haemophilus influenzae type B) – 1st dose", "IPV (Inactivated Polio Vaccine) – 1st dose", "Rotavirus Vaccine – 1st dose", "Pneumococcal Conjugate Vaccine (PCV) – 1st dose"],
    tenWeeks: ["DTP – 2nd dose", "Hepatitis B (3rd dose)", "Hib – 2nd dose", "IPV – 2nd dose", "Rotavirus – 2nd dose", "PCV – 2nd dose"],
    fourteenWeeks: ["DTP – 3rd dose", "Hepatitis B (4th dose)", "Hib – 3rd dose", "IPV – 3rd dose", "Rotavirus – 3rd dose", "PCV – 3rd dose"],
    sixMonths: ["Influenza Vaccine (Annual Dose Recommended)"],
    nineMonths: ["Measles, Mumps, Rubella (MMR) – 1st dose", "Yellow Fever Vaccine (if applicable in your region)"],
    twelveMonths: ["PCV Booster", "Hib Booster", "Hepatitis A (1st dose)"],
    fifteenMonths: ["DTP Booster (1st dose)", "IPV Booster (1st dose)", "MMR (2nd dose)", "Varicella (Chickenpox) – 1st dose", "Hepatitis A (2nd dose)"],
    fourToSixYears: ["DTP Booster (2nd dose)", "IPV Booster (2nd dose)", "MMR (3rd dose, if required)", "Varicella (2nd dose)"],
    tenToTwelveYears: ["HPV Vaccine (for girls and boys to prevent cervical and other cancers)", "Tdap (Tetanus, Diphtheria, Pertussis Booster)"],
    sixteenToEighteenYears: ["Meningococcal Vaccine (Booster dose if required)"]
  },
  
  concerns: {
    safety: "Yes, vaccines undergo rigorous testing and trials before approval. Side effects, if any, are usually mild, such as fever or soreness at the injection site.",
    autism: "No, extensive research has debunked this myth. There is no scientific link between vaccines and autism.",
    missedVaccine: "If a child misses a scheduled vaccine, consult a doctor to catch up with the immunization schedule.",
    sideEffects: "Most side effects are mild and temporary. Common ones include fever, swelling, and irritability."
  },
  
  faqs: [
    {
      question: "Can my child get multiple vaccines at the same time?",
      answer: "Yes, it is safe and helps protect them sooner."
    },
    {
      question: "What if my child is sick during vaccination?",
      answer: "Minor illnesses are not a problem, but consult your doctor."
    },
    {
      question: "Are vaccines necessary for school admission?",
      answer: "Many schools require up-to-date immunization records."
    }
  ],
  
  // Add more detailed information about specific vaccines
  vaccines: {
    bcg: "BCG (Bacillus Calmette-Guérin) vaccine protects against tuberculosis. It's usually given at birth in countries where TB is common.",
    hepatitisB: "Hepatitis B vaccine prevents liver disease caused by the hepatitis B virus. The first dose is given at birth, followed by additional doses at 6 weeks, 10 weeks, and 14 weeks.",
    dtp: "DTP vaccine protects against three serious diseases: diphtheria (a throat infection), tetanus (lockjaw), and pertussis (whooping cough).",
    hib: "Hib vaccine prevents Haemophilus influenzae type b infections, which can cause meningitis, pneumonia, and other serious illnesses in young children.",
    ipv: "IPV (Inactivated Polio Vaccine) protects against poliomyelitis, a disease that can cause permanent paralysis.",
    rotavirus: "Rotavirus vaccine prevents severe diarrhea caused by rotavirus infection, which is a leading cause of dehydration in infants and young children.",
    pcv: "PCV (Pneumococcal Conjugate Vaccine) protects against pneumococcal infections, which can cause pneumonia, meningitis, and blood infections.",
    mmr: "MMR vaccine protects against measles, mumps, and rubella. Measles can cause brain inflammation, mumps can cause sterility, and rubella can cause birth defects if a pregnant woman is infected.",
    varicella: "Varicella vaccine prevents chickenpox, a highly contagious disease that causes an itchy rash with blisters.",
    hpv: "HPV (Human Papillomavirus) vaccine prevents certain types of cancer, including cervical cancer in women and throat cancers in men and women."
  },
  
  // Add information about vaccine-preventable diseases
  diseases: {
    tuberculosis: "Tuberculosis (TB) is a bacterial infection that primarily affects the lungs. It can spread to other parts of the body and can be fatal if not treated properly.",
    hepatitisB: "Hepatitis B is a viral infection that attacks the liver and can cause both acute and chronic disease. It can lead to liver cirrhosis and cancer.",
    diphtheria: "Diphtheria is a serious bacterial infection that affects the mucous membranes of the throat and nose. It can lead to breathing problems, heart failure, paralysis, and even death.",
    tetanus: "Tetanus, also known as lockjaw, is a serious bacterial infection that causes painful muscle spasms and can lead to death.",
    pertussis: "Pertussis, or whooping cough, is a highly contagious respiratory disease that causes uncontrollable, violent coughing fits that make it hard to breathe.",
    polio: "Polio is a viral disease that can affect the nervous system and cause paralysis.",
    measles: "Measles is a highly contagious viral disease that can cause severe complications including pneumonia, encephalitis, and death.",
    mumps: "Mumps is a viral infection that primarily affects the salivary glands. It can lead to complications such as meningitis and infertility.",
    rubella: "Rubella, or German measles, is a contagious viral infection. If a pregnant woman gets rubella, her baby could be born with serious birth defects."
  },
  
  // Add information about vaccine administration
  administration: {
    preparation: "Before vaccination, make sure your child is healthy. If they have a mild illness like a cold, they can still receive vaccines, but for more serious illnesses, it's best to wait until they recover.",
    duringVaccination: "During vaccination, hold your child securely and comfort them. Distraction techniques like singing or talking can help reduce anxiety.",
    afterVaccination: "After vaccination, your child might experience mild side effects like soreness at the injection site, mild fever, or irritability. These usually resolve within a day or two.",
    painManagement: "To manage pain, you can apply a cold compress to the injection site and give appropriate doses of pain relievers like acetaminophen or ibuprofen as recommended by your doctor."
  }
};

// Helper function to find answers based on user input
const findAnswer = (query: string) => {
  query = query.toLowerCase();
  
  // Check for keywords and return appropriate responses
  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return "Hello! I'm VacciBot, your vaccination assistant. How can I help you today?";
  }
  
  if (query.includes("introduction") || query.includes("what is vaccination")) {
    return vaccinationGuideContent.introduction;
  }
  
  if (query.includes("importance") || query.includes("why") || query.includes("benefits")) {
    return "Vaccination is important for:\n• " + vaccinationGuideContent.importance.join("\n• ");
  }
  
  if (query.includes("schedule") || query.includes("when") || query.includes("timeline")) {
    return "Here's a brief vaccination schedule:\n\nAt Birth:\n• " + 
      vaccinationGuideContent.schedule.birth.join("\n• ") + 
      "\n\n6 Weeks:\n• " + vaccinationGuideContent.schedule.sixWeeks.join("\n• ") +
      "\n\nFor a complete schedule, please ask about specific age groups.";
  }
  
  if (query.includes("birth") || query.includes("newborn")) {
    return "Vaccines at birth:\n• " + vaccinationGuideContent.schedule.birth.join("\n• ");
  }
  
  if (query.includes("6 weeks") || query.includes("six weeks") || query.includes("1.5 months")) {
    return "Vaccines at 6 weeks:\n• " + vaccinationGuideContent.schedule.sixWeeks.join("\n• ");
  }
  
  if (query.includes("10 weeks") || query.includes("ten weeks") || query.includes("2.5 months")) {
    return "Vaccines at 10 weeks:\n• " + vaccinationGuideContent.schedule.tenWeeks.join("\n• ");
  }
  
  if (query.includes("14 weeks") || query.includes("fourteen weeks") || query.includes("3.5 months")) {
    return "Vaccines at 14 weeks:\n• " + vaccinationGuideContent.schedule.fourteenWeeks.join("\n• ");
  }
  
  if (query.includes("6 months") || query.includes("six months")) {
    return "Vaccines at 6 months:\n• " + vaccinationGuideContent.schedule.sixMonths.join("\n• ");
  }
  
  if (query.includes("9 months") || query.includes("nine months")) {
    return "Vaccines at 9 months:\n• " + vaccinationGuideContent.schedule.nineMonths.join("\n• ");
  }
  
  if (query.includes("12 months") || query.includes("twelve months") || query.includes("1 year")) {
    return "Vaccines at 12-15 months:\n• " + vaccinationGuideContent.schedule.twelveMonths.join("\n• ");
  }
  
  if (query.includes("15 months") || query.includes("fifteen months")) {
    return "Vaccines at 15-18 months:\n• " + vaccinationGuideContent.schedule.fifteenMonths.join("\n• ");
  }
  
  if (query.includes("4-6 years") || query.includes("four to six years")) {
    return "Vaccines at 4-6 years:\n• " + vaccinationGuideContent.schedule.fourToSixYears.join("\n• ");
  }
  
  if (query.includes("10-12 years") || query.includes("ten to twelve years")) {
    return "Vaccines at 10-12 years:\n• " + vaccinationGuideContent.schedule.tenToTwelveYears.join("\n• ");
  }
  
  if (query.includes("16-18 years") || query.includes("sixteen to eighteen years")) {
    return "Vaccines at 16-18 years:\n• " + vaccinationGuideContent.schedule.sixteenToEighteenYears.join("\n• ");
  }
  
  if (query.includes("safe") || query.includes("safety")) {
    return "Are vaccines safe? " + vaccinationGuideContent.concerns.safety;
  }
  
  if (query.includes("autism")) {
    return "Can vaccines cause autism? " + vaccinationGuideContent.concerns.autism;
  }
  
  if (query.includes("miss") || query.includes("missed")) {
    return "What if my child misses a vaccine? " + vaccinationGuideContent.concerns.missedVaccine;
  }
  
  if (query.includes("side effect") || query.includes("reaction")) {
    return "Vaccine side effects: " + vaccinationGuideContent.concerns.sideEffects;
  }
  
  if (query.includes("multiple vaccines") || query.includes("same time")) {
    return "Can my child get multiple vaccines at the same time? " + vaccinationGuideContent.faqs[0].answer;
  }
  
  if (query.includes("sick") || query.includes("ill")) {
    return "What if my child is sick during vaccination? " + vaccinationGuideContent.faqs[1].answer;
  }
  
  if (query.includes("school")) {
    return "Are vaccines necessary for school admission? " + vaccinationGuideContent.faqs[2].answer;
  }
  
  if (query.includes("faq") || query.includes("frequently asked")) {
    return "Frequently Asked Questions:\n\n" + 
      vaccinationGuideContent.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");
  }
  
  // Add more responses for specific vaccines
  if (query.includes("bcg") || query.includes("tuberculosis vaccine")) {
    return "BCG Vaccine: " + vaccinationGuideContent.vaccines.bcg;
  }
  
  if (query.includes("hepatitis b") || query.includes("hep b")) {
    return "Hepatitis B Vaccine: " + vaccinationGuideContent.vaccines.hepatitisB;
  }
  
  if (query.includes("dtp") || query.includes("diphtheria") || query.includes("tetanus") || query.includes("pertussis")) {
    return "DTP Vaccine: " + vaccinationGuideContent.vaccines.dtp;
  }
  
  if (query.includes("hib") || query.includes("haemophilus")) {
    return "Hib Vaccine: " + vaccinationGuideContent.vaccines.hib;
  }
  
  if (query.includes("ipv") || query.includes("polio")) {
    return "IPV Vaccine: " + vaccinationGuideContent.vaccines.ipv;
  }
  
  if (query.includes("rotavirus")) {
    return "Rotavirus Vaccine: " + vaccinationGuideContent.vaccines.rotavirus;
  }
  
  if (query.includes("pcv") || query.includes("pneumococcal")) {
    return "PCV Vaccine: " + vaccinationGuideContent.vaccines.pcv;
  }
  
  if (query.includes("mmr") || query.includes("measles") || query.includes("mumps") || query.includes("rubella")) {
    return "MMR Vaccine: " + vaccinationGuideContent.vaccines.mmr;
  }
  
  if (query.includes("varicella") || query.includes("chickenpox")) {
    return "Varicella Vaccine: " + vaccinationGuideContent.vaccines.varicella;
  }
  
  if (query.includes("hpv") || query.includes("human papillomavirus")) {
    return "HPV Vaccine: " + vaccinationGuideContent.vaccines.hpv;
  }
  
  // Add responses for diseases
  if (query.includes("what is tuberculosis") || query.includes("tb disease")) {
    return "Tuberculosis: " + vaccinationGuideContent.diseases.tuberculosis;
  }
  
  if (query.includes("what is hepatitis b") || query.includes("hep b disease")) {
    return "Hepatitis B: " + vaccinationGuideContent.diseases.hepatitisB;
  }
  
  if (query.includes("what is diphtheria")) {
    return "Diphtheria: " + vaccinationGuideContent.diseases.diphtheria;
  }
  
  if (query.includes("what is tetanus") || query.includes("lockjaw")) {
    return "Tetanus: " + vaccinationGuideContent.diseases.tetanus;
  }
  
  if (query.includes("what is pertussis") || query.includes("whooping cough")) {
    return "Pertussis: " + vaccinationGuideContent.diseases.pertussis;
  }
  
  if (query.includes("what is polio") || query.includes("poliomyelitis")) {
    return "Polio: " + vaccinationGuideContent.diseases.polio;
  }
  
  if (query.includes("what is measles")) {
    return "Measles: " + vaccinationGuideContent.diseases.measles;
  }
  
  if (query.includes("what is mumps")) {
    return "Mumps: " + vaccinationGuideContent.diseases.mumps;
  }
  
  if (query.includes("what is rubella") || query.includes("german measles")) {
    return "Rubella: " + vaccinationGuideContent.diseases.rubella;
  }
  
  // Add responses for vaccine administration
  if (query.includes("prepare") || query.includes("before vaccination")) {
    return "Preparing for vaccination: " + vaccinationGuideContent.administration.preparation;
  }
  
  if (query.includes("during vaccination")) {
    return "During vaccination: " + vaccinationGuideContent.administration.duringVaccination;
  }
  
  if (query.includes("after vaccination") || query.includes("post vaccination")) {
    return "After vaccination: " + vaccinationGuideContent.administration.afterVaccination;
  }
  
  if (query.includes("pain") || query.includes("manage pain") || query.includes("reduce pain")) {
    return "Managing pain after vaccination: " + vaccinationGuideContent.administration.painManagement;
  }
  
  // Add responses for common parent questions
  if (query.includes("fever after") || query.includes("temperature after")) {
    return "It's normal for children to develop a mild fever after vaccination. This is a sign that the body is building immunity. If the fever is high (above 102°F or 39°C) or lasts more than 48 hours, consult your doctor.";
  }
  
  if (query.includes("redness") || query.includes("swelling") || query.includes("injection site")) {
    return "Redness, swelling, or soreness at the injection site is common after vaccination. You can apply a clean, cool washcloth to the area to reduce discomfort. If the reaction is severe or persists for more than a few days, consult your doctor.";
  }
  
  if (query.includes("allergic reaction") || query.includes("severe reaction")) {
    return "Severe allergic reactions to vaccines are very rare but require immediate medical attention. Signs include high fever, behavior changes, difficulty breathing, hoarseness, wheezing, hives, paleness, weakness, fast heartbeat, or dizziness within minutes to hours after vaccination.";
  }
  
  if (query.includes("combination vaccines") || query.includes("combined vaccines")) {
    return "Combination vaccines protect against multiple diseases with a single shot, reducing the number of injections needed. They are safe and effective, and do not overload the immune system. Examples include the MMR (measles, mumps, rubella) and DTaP (diphtheria, tetanus, pertussis) vaccines.";
  }
  
  if (query.includes("catch up") || query.includes("missed schedule") || query.includes("behind schedule")) {
    return "If your child has missed some vaccines, they can still catch up. Talk to your healthcare provider about a catch-up schedule. Most vaccines can be given at any time, and your child won't need to restart a vaccine series if they've missed a dose.";
  }
  
  if (query.includes("travel") || query.includes("traveling") || query.includes("international")) {
    return "If you're traveling internationally with your child, they may need additional vaccines depending on your destination. Consult with your healthcare provider or a travel medicine specialist at least 4-6 weeks before your trip to ensure your child is properly protected.";
  }
  
  if (query.includes("record") || query.includes("documentation") || query.includes("proof")) {
    return "Keep a record of your child's vaccinations. This documentation is important for school enrollment, travel, and future medical care. If you've lost your child's vaccination records, contact their healthcare provider or your state's immunization information system.";
  }
  
  // Default response if no keywords match
  return "I'm not sure about that. You can ask me about vaccination schedules, specific vaccines, vaccine-preventable diseases, or how to prepare for and manage vaccinations. Try asking something like 'What is the MMR vaccine?' or 'How do I prepare my child for vaccination?'";
};

type Message = {
  text: string;
  isUser: boolean;
};

export const Chatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm VacciBot, your vaccination assistant. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Suggested questions to help users get started
  const suggestions = [
    "What vaccines are needed at birth?",
    "Tell me about the MMR vaccine",
    "What are common side effects?",
    "Is it safe to get multiple vaccines?",
    "What is the vaccination schedule?"
  ];
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Focus input when chatbot opens
  useEffect(() => {
    if (showChatbot && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChatbot]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    // Get bot response
    const botResponse = findAnswer(inputValue);
    
    // Add bot response with a small delay to simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    }, 500);
    
    // Clear input
    setInputValue("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
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
      
      {/* Chatbot UI */}
      {showChatbot && (
        <div className="fixed bottom-24 right-8 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 border flex flex-col">
          <div className="bg-vaccine-blue text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-blue-100">
                <AvatarImage src="/chatbot-avatar.png" alt="Chatbot" />
                <AvatarFallback className="bg-blue-100 text-vaccine-blue">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">VacciBot Assistant</span>
                <p className="text-xs opacity-80">Online</p>
              </div>
            </div>
            <button onClick={() => setShowChatbot(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <ScrollArea className="p-4 h-96 flex-1">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  {!message.isUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-vaccine-blue">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`p-3 rounded-lg max-w-[85%] ${
                      message.isUser 
                        ? "bg-vaccine-blue text-white rounded-tr-none" 
                        : "bg-gray-100 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {/* Show suggestions if there are only a few messages */}
              {messages.length < 3 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
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
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t p-3 flex gap-2">
            <Input 
              ref={inputRef}
              placeholder="Type your message..." 
              className="flex-1" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
