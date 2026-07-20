import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Minus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Chatbot.css';
import { companyInfo, services, itServicesData } from '../mockData';
import { bookingStore } from '../utils/bookingStore';
const initialMessages = [
  { sender: 'bot', text: `Hi there! Welcome to ${companyInfo.name}. How can I help you today?` }
];
const DEFAULT_QUICK_REPLIES = ["Book a service", "Track my ticket", "What are your services?", "Pricing info", "Contact details"];
const hardwareMap = services.map(s => {
  let label = s.title;
  if (s.title.includes("Laptop Repair")) label = "Laptop Repair";
  else if (s.title.includes("Computer Repair")) label = "Computer Repair";
  else if (s.title.includes("Printer Repair")) label = "Printer Repair";
  else if (s.title.includes("Chip Level")) label = "Chip Level Service";
  else if (s.title.includes("Data Backup")) label = "Data Backup";
  else if (s.title.includes("Software Installation")) label = "Software Install";
  else if (s.title.includes("Custom PC")) label = "Custom PC Build";
  else if (s.title.includes("Refurbished Laptops")) label = "Refurbished Laptops";
  else if (s.title.includes("New Laptops")) label = "New Laptops";
  else if (s.title.includes("Accessories")) label = "Accessories Sales";
  return { label, title: s.title, price: s.priceRange };
});
const itMap = itServicesData.map(s => {
  let label = s.title;
  if (s.title.includes("Website Development")) label = "Website Development";
  return { label, title: s.title, price: s.priceRange };
});
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [quickReplies, setQuickReplies] = useState(DEFAULT_QUICK_REPLIES);
  const [isWaitingForTicket, setIsWaitingForTicket] = useState(false);
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
    setTimeout(async () => {
      const lowerText = text.toLowerCase().trim();
      let botResponse = "I'm sorry, I didn't quite catch that. Could you try rephrasing or choose one of the quick options below?";
      let nextReplies = DEFAULT_QUICK_REPLIES;
      const isTicketPattern = /^sian-\d{4}-\d+$/i.test(lowerText);
      const matchedHW = hardwareMap.find(h =>
        lowerText === h.label.toLowerCase() ||
        lowerText === h.title.toLowerCase() ||
        (lowerText.includes("laptop") && h.label === "Laptop Repair" && (lowerText.includes("repair") || lowerText.includes("service"))) ||
        (lowerText.includes("computer") && h.label === "Computer Repair" && (lowerText.includes("repair") || lowerText.includes("service"))) ||
        (lowerText.includes("printer") && h.label === "Printer Repair" && (lowerText.includes("repair") || lowerText.includes("service"))) ||
        (lowerText.includes("drone") && h.label === "Drone Service") ||
        (lowerText.includes("chip") && h.label === "Chip Level Service") ||
        (lowerText.includes("cctv") && h.label === "CCTV Installation") ||
        (lowerText.includes("backup") && h.label === "Data Backup") ||
        (lowerText.includes("software") && h.label === "Software Install") ||
        (lowerText.includes("custom") && h.label === "Custom PC Build") ||
        (lowerText.includes("refurbished") && h.label === "Refurbished Laptops") ||
        (lowerText.includes("new laptop") && h.label === "New Laptops") ||
        (lowerText.includes("accessory") && h.label === "Accessories Sales")
      );
      const matchedIT = itMap.find(i =>
        lowerText === i.label.toLowerCase() ||
        lowerText === i.title.toLowerCase() ||
        (lowerText.includes("web") && i.label === "Website Development") ||
        (lowerText.includes("freelance") && i.label === "Freelancing IT Services")
      );
      if (lowerText === "main menu" || lowerText === "back to main") {
        botResponse = "How else can I assist you today?";
        nextReplies = DEFAULT_QUICK_REPLIES;
        setIsWaitingForTicket(false);
      } else if (isWaitingForTicket || isTicketPattern) {
        try {
          const booking = await bookingStore.getBookingByTicket(text.trim());
          if (booking) {
            const statusClass = booking.status === 'Completed' ? 'chat-status-completed' : booking.status === 'Cancelled' ? 'chat-status-cancelled' : 'chat-status-other';
            botResponse = (
              <div className="chat-tracking-info">
                <p className="chat-tracking-header">🔍 <strong>Status for Ticket #{booking.ticketId}:</strong></p>
                <div className="chat-tracking-fields">
                  <div>👤 <strong>Customer:</strong> {booking.name}</div>
                  <div>🛠️ <strong>Service:</strong> {booking.service}</div>
                  <div>📌 <strong>Status:</strong>{' '}
                    <span className={`chat-status-badge ${statusClass}`}>{booking.status}</span>
                  </div>
                  <div>💰 <strong>Estimated Cost:</strong> {booking.estimatedCost}</div>
                  <div>📅 <strong>Estimated Delivery:</strong> {booking.estimatedDelivery}</div>
                  <div className="chat-tracking-notes-container">
                    📝 <strong>Notes:</strong> <span className="chat-notes-text">"{booking.notes}"</span>
                  </div>
                </div>
              </div>
            );
            nextReplies = ["Track Another Ticket", "Main Menu"];
            setIsWaitingForTicket(false);
          } else {
            botResponse = (
              <span>
                I couldn't find any service record for Ticket ID <strong>{text}</strong>. Please check the ID and try again, or type <strong>Main Menu</strong> to exit.
              </span>
            );
            nextReplies = ["Main Menu"];
            setIsWaitingForTicket(true);
          }
        } catch (err) {
          console.error("Error fetching ticket in chat:", err);
          botResponse = "Sorry, I encountered an error checking your ticket status. Please try again later or visit our Track Ticket page.";
          nextReplies = DEFAULT_QUICK_REPLIES;
          setIsWaitingForTicket(false);
        }
      } else if (lowerText === "track another ticket" || lowerText === "track another service") {
        botResponse = (
          <span>Please enter your <strong>Ticket ID</strong> (e.g., <code>SIAN-2026-1002</code>) to track your service live, or visit our{' '}
            <Link to="/track" className="chat-link" onClick={() => setIsOpen(false)}>Track Ticket</Link> page.
          </span>
        );
        nextReplies = ["Main Menu"];
        setIsWaitingForTicket(true);
      } else if (lowerText === "hardware services") {
        botResponse = "Here are our Hardware Services. Click one of the options below to see its pricing:";
        nextReplies = [...hardwareMap.map(h => h.label), "Back to Pricing", "Main Menu"];
      } else if (lowerText === "it services") {
        botResponse = "Here are our IT Services. Click one of the options below to see its pricing:";
        nextReplies = [...itMap.map(i => i.label), "Back to Pricing", "Main Menu"];
      } else if (matchedHW) {
        botResponse = (
          <span>The pricing for <strong>{matchedHW.title}</strong> is <strong>{matchedHW.price}</strong>.</span>
        );
        nextReplies = ["Check More Prices", "Main Menu"];
      } else if (matchedIT) {
        botResponse = (
          <span>The pricing for <strong>{matchedIT.title}</strong> is <strong>{matchedIT.price}</strong>.</span>
        );
        nextReplies = ["Check More Prices", "Main Menu"];
      } else if (
        lowerText.includes("price") ||
        lowerText.includes("cost") ||
        lowerText.includes("pricing") ||
        lowerText === "back to pricing" ||
        lowerText === "check more prices"
      ) {
        botResponse = (
          <span>Would you like to check the pricing for <strong>Hardware Services</strong> or <strong>IT Services</strong>?</span>
        );
        nextReplies = ["Hardware Services", "IT Services", "Main Menu"];
      } else if (lowerText.includes("book") || lowerText.includes("booking") || lowerText.includes("appoint") || lowerText.includes("reserve")) {
        botResponse = (
          <span>You can book a service directly on our{' '}
            <Link to="/book-service" className="chat-link" onClick={() => setIsOpen(false)}> Book Service</Link>{' '}page. Fill out the details, and we'll confirm your schedule!
          </span>
        );
        nextReplies = DEFAULT_QUICK_REPLIES;
      } else if (lowerText.includes("track") || lowerText.includes("status") || lowerText.includes("where") || lowerText.includes("ticket")) {
        botResponse = (
          <span>Please enter your <strong>Ticket ID</strong> (e.g., <code>SIAN-2026-1002</code>) to track your service live, or visit our{' '}
            <Link to="/track" className="chat-link" onClick={() => setIsOpen(false)}>Track Ticket</Link> page.
          </span>
        );
        nextReplies = ["Main Menu"];
        setIsWaitingForTicket(true);
      } else if (lowerText.includes("service") || lowerText.includes("what do you do")) {
        botResponse = (
          <div className="chat-services-list">
            <p>We offer a variety of services:</p>
            <strong>Hardware & Repair Services:</strong>
            <ul>
              {services.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
            <strong>IT Services:</strong>
            <ul className="mb-4">
              {itServicesData.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
            <p className="chat-services-footer">
              Click on <strong>Pricing info</strong> or ask about any service to see details.
            </p>
          </div>
        );
        nextReplies = DEFAULT_QUICK_REPLIES;
      } else if (
        lowerText.includes("hardware contact") ||
        (lowerText.includes("contact") && lowerText.includes("hardware"))
      ) {
        botResponse = (
          <div className="chat-contact-info">
            <p><strong>Hardware Services Contact:</strong></p>
            <div className="chat-tracking-fields">
              <div>📞 <strong>Contact Number:</strong> {companyInfo.phone}</div>
              <div>✉️ <strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} className="chat-link">{companyInfo.email}</a></div>
              <div>📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/sian_smart_tech?igsh=MTJ5Y3YybXl3aXBrYQ==" target="_blank" rel="noopener noreferrer" className="chat-link">@sian_smart_tech</a></div>
              <div>📍 <strong>Shop Location:</strong> {companyInfo.address}</div>
            </div>
          </div>
        );
        nextReplies = DEFAULT_QUICK_REPLIES;
      } else if (
        lowerText.includes("it contact") ||
        (lowerText.includes("contact") && lowerText.includes("it"))
      ) {
        botResponse = (
          <div className="chat-contact-info">
            <p><strong>IT Services Contact:</strong></p>
            <div className="chat-tracking-fields">
              <div>📞 <strong>Contact Number:</strong> 8056534429</div>
              <div>✉️ <strong>Email:</strong> <a href="mailto:santhoshsandy81140@gmail.com" className="chat-link">santhoshsandy81140@gmail.com</a></div>
            </div>
          </div>
        );
        nextReplies = DEFAULT_QUICK_REPLIES;
      } else if (lowerText.includes("contact") || lowerText.includes("phone") || lowerText.includes("email") || lowerText.includes("address")) {
        botResponse = "Would you like the contact details for Hardware Services or IT Services?";
        nextReplies = ["Hardware Contact", "IT Contact", "Main Menu"];
      } else if (lowerText.includes("hour") || lowerText.includes("time") || lowerText.includes("open")) {
        botResponse = `Our business hours are: ${companyInfo.hours}.`;
        nextReplies = DEFAULT_QUICK_REPLIES;
      } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
        botResponse = "Hello! How can I assist you today?";
        nextReplies = DEFAULT_QUICK_REPLIES;
      } else {
        nextReplies = quickReplies;
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setQuickReplies(nextReplies);
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