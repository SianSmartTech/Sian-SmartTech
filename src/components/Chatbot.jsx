import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Minus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Chatbot.css';
import { companyInfo, services } from '../mockData';
const initialMessages = [
  { sender: 'bot', text: `Hi there! Welcome to ${companyInfo.name}. How can I help you today?` }
];
const quickReplies = ["Book a service", "Track my service", "What are your services?", "Pricing info", "Contact details"];
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  const handleSend = (text) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputValue('');
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let botResponse = "I'm sorry, I didn't quite catch that. Could you try rephrasing or choose one of the quick options below?";
      if (lowerText.includes("book") || lowerText.includes("booking") || lowerText.includes("appoint") || lowerText.includes("reserve")) {
        botResponse = (
          <span>You can book a service directly on our{' '}
            <Link to="/book-service" className="chat-link" onClick={() => setIsOpen(false)}> Book Service</Link>{' '}page. Fill out the details, and we'll confirm your schedule!
          </span>
        );
      } else if (lowerText.includes("track") || lowerText.includes("status") || lowerText.includes("where") || lowerText.includes("ticket")) {
        botResponse = (
          <span>You can track the status of your service/repair on our{' '}
            <Link to="/track" className="chat-link" onClick={() => setIsOpen(false)}>Track Service</Link>{' '}page. Just enter your Ticket ID to see the updates.
          </span>
        );
      } else if (lowerText.includes("service") || lowerText.includes("what do you do")) {
        const serviceNames = services.map(s => s.title).join(', ');
        botResponse = `We offer a variety of services including: ${serviceNames}. Which one would you like to know more about?`;
      } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("pricing")) {
        botResponse = "Our general diagnostics fee is ₹150, and standard repair/general service starts at ₹350. Prices vary depending on the issue and complexity. For a detailed estimate, please contact us!";
      } else if (lowerText.includes("contact") || lowerText.includes("phone") || lowerText.includes("email") || lowerText.includes("address")) {
        botResponse = `You can reach us at ${companyInfo.phone} or email us at ${companyInfo.email}. We are located at ${companyInfo.address}.`;
      } else if (lowerText.includes("hour") || lowerText.includes("time") || lowerText.includes("open")) {
        botResponse = `Our business hours are: ${companyInfo.hours}.`;
      } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
        botResponse = "Hello! How can I assist you today?";
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };
  return (
    <>
      <div className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <MessageSquare size={24} />
      </div>
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-title">
            <MessageSquare size={20} />
            <span>Support Chat</span>
          </div>
          <div className="chatbot-header-actions">
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <Minus size={20} />
            </button>
          </div>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message-wrapper ${msg.sender}`}>
              <div className="chat-message">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-quick-replies">
          {quickReplies.map((reply, idx) => (
            <button key={idx} className="quick-reply-btn" onClick={() => handleSend(reply)}> {reply}</button>
          ))}
        </div>
        <div className="chatbot-input">
          <input type="text" placeholder="Type a message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)} />
          <button onClick={() => handleSend(inputValue)} className="send-btn">
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
export default Chatbot;