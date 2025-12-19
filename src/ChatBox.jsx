import { useState, useRef, useEffect } from 'react'
import './ChatBox.css'

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?",
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
    "¡Esa es una pregunta interesante! Déjame pensar sobre eso...",
    "Entiendo lo que estás preguntando. Esto es lo que puedo decirte:",
    "¡Excelente pregunta! Según mi conocimiento, diría que...",
    "¡Estoy aquí para ayudar! Déjame proporcionarte información sobre eso.",
    "¡Gracias por preguntar! Aquí está mi perspectiva sobre esto:",
    "Es un buen punto. Déjame explicarlo más a fondo...",
    "Aprecio tu consulta. Según lo que sé..."
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
        <h2>Edilberto Enrique Vilca Castro</h2>
        <p className="chatbox-subtitle">¡Pregúntame lo que quieras!</p>
      </div>
      
      <div className="chatbox-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-ai'}`}
          >
            <div className="message-content">
              <div className="message-sender">
                {message.sender === 'user' ? 'Tú' : 'Asistente de IA'}
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
          placeholder="Escribe tu mensaje..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="chatbox-send-button">
          Enviar
        </button>
      </form>
    </div>
  )
}

export default ChatBox
