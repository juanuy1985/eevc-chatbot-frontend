import { useState, useRef, useEffect } from 'react'
import './ChatBox.css'

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const messageIdCounter = useRef(2)
  const timeoutsRef = useRef(new Set())

  // Mock AI responses
  const mockAIResponses = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's what I can tell you:",
    "Great question! Based on my knowledge, I would say...",
    "I'm here to help! Let me provide some information about that.",
    "Thanks for asking! Here's my perspective on this:",
    "That's a good point. Let me explain further...",
    "I appreciate your inquiry. From what I know..."
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Cleanup all timeouts on unmount
    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach(timeoutId => clearTimeout(timeoutId))
      timeouts.clear()
    }
  }, [])

  const getRandomAIResponse = () => {
    const randomIndex = Math.floor(Math.random() * mockAIResponses.length)
    return mockAIResponses[randomIndex]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (inputValue.trim() === '') return

    // Add user message
    const userMessage = {
      id: messageIdCounter.current++,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prevMessages => [...prevMessages, userMessage])
    setInputValue('')

    // Simulate AI response with a delay
    const timeoutId = setTimeout(() => {
      const aiMessage = {
        id: messageIdCounter.current++,
        text: getRandomAIResponse(),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, aiMessage])
      timeoutsRef.current.delete(timeoutId)
    }, 1000)
    
    timeoutsRef.current.add(timeoutId)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>AI Chatbot</h2>
        <p className="chatbox-subtitle">Ask me anything!</p>
      </div>
      
      <div className="chatbox-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-ai'}`}
          >
            <div className="message-content">
              <div className="message-sender">
                {message.sender === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbox-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chatbox-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="chatbox-send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatBox
