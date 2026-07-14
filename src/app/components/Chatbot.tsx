"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

const predefinedQA = [
  {
    question: "What is FipMoney?",
    answer: "FipMoney is a digital gold investment platform that allows you to invest in gold through SIP (Systematic Investment Plan) starting from just ₹1. You can buy, sell, and track your gold investments digitally with real-time pricing and secure storage."
  },
  {
    question: "How does SIP work in gold investment?",
    answer: "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in digital gold. You can choose daily, weekly, or monthly investments. This helps in rupee cost averaging, reducing the impact of gold price volatility and building wealth systematically."
  },
  {
    question: "What is the minimum investment amount?",
    answer: "You can start investing in digital gold with as little as ₹1! This makes gold investment accessible to everyone. There's no maximum limit, so you can invest according to your financial goals and capacity."
  },
  {
    question: "Is my gold investment secure?",
    answer: "Yes, absolutely! Your digital gold is backed by 24K 999.9 purity physical gold stored in secure vaults. All investments are insured and audited regularly. You get complete transparency with real-time tracking and can convert to physical gold anytime."
  },
  {
    question: "Can I get physical gold delivery?",
    answer: "Yes! You can convert your digital gold to physical gold and get it delivered to your doorstep. We offer coins, bars, and jewelry options. You can also sell your digital gold instantly for cash at current market rates."
  },
  {
    question: "How do I track my investments?",
    answer: "FipMoney provides a comprehensive dashboard where you can track your portfolio in real-time. Monitor your investment value, returns, gold price trends, and transaction history all in one place with beautiful charts and analytics."
  },
  {
    question: "What are the charges for using FipMoney?",
    answer: "We believe in transparent pricing with no hidden charges. There's a small transaction fee for buying/selling gold, and storage charges are minimal. No account maintenance fees or annual charges. Check our pricing page for detailed information."
  },
  {
    question: "How do I start investing?",
    answer: "Getting started is super easy! Download the FipMoney app, complete your KYC verification in under 2 minutes, choose your SIP plan, and start investing. You can begin with just ₹1 and increase your investment amount anytime."
  },
  {
    question: "Can I pause or stop my SIP?",
    answer: "Yes, you have complete flexibility! You can pause, resume, increase, decrease, or stop your SIP anytime without any penalty. Your existing investments remain safe and continue to grow with gold price appreciation."
  },
  {
    question: "What makes FipMoney different from other platforms?",
    answer: "FipMoney offers the lowest minimum investment (₹1), highest gold purity (999.9), real-time pricing, instant selling, flexible SIP options, comprehensive analytics, and seamless physical gold conversion. Plus, our user-friendly interface makes gold investment simple for everyone."
  }
];

const suggestedQuestions = [
  "What is FipMoney?",
  "How does SIP work?",
  "What's the minimum investment?",
  "Is my investment secure?",
  "How do I start investing?",
  "Can I get physical gold?"
];

const TypingIndicator = () => (
  <motion.div
    className="flex items-center space-x-2 p-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-[#ffbf00] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">FipBot is typing...</span>
  </motion.div>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <motion.div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152]' : 'bg-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {isBot ? (
            <Bot className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </motion.div>
        
        {/* Message */}
        <motion.div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isBot 
              ? 'bg-white border border-gray-200 text-gray-800' 
              : 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-1 ${isBot ? 'text-gray-400' : 'text-white/70'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SuggestedQuestion = ({ question, onClick }: { question: string; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="bg-gradient-to-r from-[#fff8dc] to-[#ffe485] hover:from-[#ffbf00] hover:to-[#ffd152] hover:text-white text-[#b38200] px-3 py-2 rounded-full text-sm transition-all duration-300 border border-[#ffd152] hover:border-[#ffbf00] hover:shadow-md"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {question}
  </motion.button>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm FipBot, your digital gold investment assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const findAnswer = (question: string): string => {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Find exact or partial matches
    const match = predefinedQA.find(qa => 
      qa.question.toLowerCase().includes(normalizedQuestion) ||
      normalizedQuestion.includes(qa.question.toLowerCase()) ||
      qa.question.toLowerCase().split(' ').some(word => normalizedQuestion.includes(word))
    );
    
    if (match) {
      return match.answer;
    }
    
    // Keyword-based responses
    if (normalizedQuestion.includes('sip') || normalizedQuestion.includes('systematic')) {
      return predefinedQA[1].answer;
    }
    if (normalizedQuestion.includes('minimum') || normalizedQuestion.includes('start')) {
      return predefinedQA[2].answer;
    }
    if (normalizedQuestion.includes('secure') || normalizedQuestion.includes('safe')) {
      return predefinedQA[3].answer;
    }
    if (normalizedQuestion.includes('physical') || normalizedQuestion.includes('delivery')) {
      return predefinedQA[4].answer;
    }
    if (normalizedQuestion.includes('track') || normalizedQuestion.includes('portfolio')) {
      return predefinedQA[5].answer;
    }
    if (normalizedQuestion.includes('charge') || normalizedQuestion.includes('fee')) {
      return predefinedQA[6].answer;
    }
    if (normalizedQuestion.includes('how') && (normalizedQuestion.includes('start') || normalizedQuestion.includes('begin'))) {
      return predefinedQA[7].answer;
    }
    if (normalizedQuestion.includes('pause') || normalizedQuestion.includes('stop')) {
      return predefinedQA[8].answer;
    }
    if (normalizedQuestion.includes('different') || normalizedQuestion.includes('unique')) {
      return predefinedQA[9].answer;
    }
    
    // Default response
    return "That's a great question! I'd be happy to help you with information about digital gold investment, SIP plans, security features, or getting started with FipMoney. Could you please be more specific about what you'd like to know?";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Get AI response
    const answer = findAnswer(text);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: answer,
      sender: 'bot',
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 z-50 magnetic pulse-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Notification Badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center md:items-center md:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md h-[80vh] md:h-[600px] flex flex-col shadow-2xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-t-3xl md:rounded-t-3xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Bot className="w-5 h-5 text-[#ffbf00]" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold">FipBot Assistant</h3>
                    <p className="text-white/80 text-sm">Always here to help</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isTyping && <TypingIndicator />}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <p className="text-sm text-gray-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <SuggestedQuestion
                        key={index}
                        question={question}
                        onClick={() => handleSuggestedQuestion(question)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about FipMoney..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#ffbf00] focus:border-transparent outline-none transition-all"
                    disabled={isTyping}
                  />
                  <motion.button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-10 h-10 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}