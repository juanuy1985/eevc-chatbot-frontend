import { useState, useRef, useEffect } from 'react'
import './ChatBox.css'
import ProductTable from './ProductTable'

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
  const [clientCode] = useState('CLI-002') // Default client code
  const messagesEndRef = useRef(null)
  const messageIdCounter = useRef(2)
  const timeoutsRef = useRef(new Set())

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

  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigoCliente: clientCode,
          message: message
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from API')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error calling API:', error)
      // Return a fallback response
      return {
        responseMessage: 'Lo siento, no pude conectarme con el servidor. Por favor, inténtalo de nuevo más tarde.',
        information: null
      }
    }
  }

  const handleSubmit = async (e) => {
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
    const currentMessage = inputValue
    setInputValue('')

    // Call the API
    const apiResponse = await sendMessageToAPI(currentMessage)
    
    // Create AI message with response and optional product information
    const aiMessage = {
      id: messageIdCounter.current++,
      text: apiResponse.responseMessage,
      sender: 'ai',
      timestamp: new Date(),
      products: apiResponse.information?.response || null
    }
    
    setMessages(prevMessages => [...prevMessages, aiMessage])
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
              {message.products && message.products.length > 0 && (
                <ProductTable products={message.products} />
              )}
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
