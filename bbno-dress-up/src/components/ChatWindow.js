import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWindowContext } from '../contexts/WindowContext';  // Add this line

function ChatWindow({ onClose, id }) {
    const { setChatWindowOpen } = useWindowContext();  // Add this line
    
    const defaultSize = {
      width: 500,
      height: 400
    };
    // ...existing state declarations...

  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Welcome to bbno$ Chat!' },
    { sender: 'bbno$', text: 'hey, what\'s up!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
const [isMinimized, setIsMinimized] = useState(false);
const [previousState, setPreviousState] = useState({
    x: 100,
    y: 100,
    width: defaultSize.width,
    height: defaultSize.height
  });
  // Add after your other useState declarations
const [windowSize, setWindowSize] = useState(defaultSize);
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!isMaximized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Add this new useEffect
  useEffect(() => {
    return () => {
      setChatWindowOpen(false);
    };
  }, [setChatWindowOpen]);

  const handleMaximize = () => {
    if (isMaximized) {
      // Restore to previous position and size
      setPosition({ x: previousState.x, y: previousState.y });
      setWindowSize({ width: previousState.width, height: previousState.height });
      setIsMaximized(false);
    } else {
      // Store current state and maximize
      setPreviousState({
        x: position.x,
        y: position.y,
        width: windowSize.width,
        height: windowSize.height
      });
      
      // Get actual window dimensions
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setWindowSize({ width: vw, height: vh });
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  };
  
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    setMessages([...messages, { sender: 'You', text: inputText }]);
    setInputText('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bbno$', 
        text: 'cool stuff! 🔥' 
      }]);
    }, 1000);
  };

  return (
    <div 
  ref={windowRef}
  style={{
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: isMaximized ? '100vw' : `${windowSize.width}px`,
    height: isMaximized ? '100vh' : `${windowSize.height}px`,
    zIndex: isMaximized ? 9999 : 10,
    display: isMinimized ? 'none' : 'block'
  }}
>
      <img 
        src={process.env.PUBLIC_URL + '/assets/windows/ChatWindow.svg'} 
        alt="Chat Window"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
      
      <div 
        style={{
          height: '25px',
          cursor: 'move',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 5px',
          color: '#ffffff'
        }}
        onMouseDown={handleMouseDown}
      >
        <span style={{ flex: 1 }}>bbno$ Chat</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          {/* Minimize Button */}
          <div style={{ position: 'relative', width: '16px', height: '14px' }}>
            <img 
              src={process.env.PUBLIC_URL + '/assets/windows/ButtonBox.svg'} 
              alt="Button Box"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
            <button 
              onClick={handleMinimize}
              title="Minimize"
              style={{
                width: '100%',
                height: '100%',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={process.env.PUBLIC_URL + '/assets/windows/MinimizeButton.svg'} 
                alt="Minimize"
                style={{
                  width: '8px',
                  height: '8px',
                  pointerEvents: 'none',
                  display: 'block',
                  margin: 'auto',
                  marginTop: '6px'
                }}
              />
            </button>
          </div>

          {/* Maximize Button */}
          <div style={{ position: 'relative', width: '16px', height: '14px' }}>
            <img 
              src={process.env.PUBLIC_URL + '/assets/windows/ButtonBox.svg'} 
              alt="Button Box"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
            <button 
              onClick={handleMaximize}
              title="Maximize"
              style={{
                width: '100%',
                height: '100%',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={process.env.PUBLIC_URL + '/assets/windows/MaximizeButton.svg'} 
                alt="Maximize"
                style={{
                  width: '8px',
                  height: '8px',
                  pointerEvents: 'none',
                  display: 'block',
                  margin: 'auto'
                }}
              />
            </button>
          </div>

          {/* Close Button */}
          <div style={{ position: 'relative', width: '16px', height: '14px' }}>
            <img 
              src={process.env.PUBLIC_URL + '/assets/windows/ButtonBox.svg'} 
              alt="Button Box"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
            <button 
            onClick={() => {
              setChatWindowOpen(false);
              onClose(id);
            }}
            title="Close"
            style={{
                width: '100%',
                height: '100%',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={process.env.PUBLIC_URL + '/assets/windows/CloseButton.svg'} 
                alt="Close"
                style={{
                  width: '8px',
                  height: '8px',
                  pointerEvents: 'none',
                  display: 'block',
                  margin: 'auto'
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '0',
        right: '0',
        bottom: '80px',
        margin: '10px',
      }}>
        <div style={{ 
          position: 'relative', 
          width: '100%',
          height: '100%',
        }}>
          <img 
            src={process.env.PUBLIC_URL + '/assets/windows/TextBox.svg'} 
            alt="Text Box"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              objectFit: 'fill'
            }}
          />
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'auto',
            padding: '10px',
            zIndex: 1
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input box container */}
      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        left: '0',
        right: '0',
        height: '60px',
        margin: '0 10px',
      }}>
        <div style={{ 
          position: 'relative', 
          width: '100%',
          height: '100%',
        }}>
          <img 
            src={process.env.PUBLIC_URL + '/assets/windows/TextBox.svg'} 
            alt="Text Box"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              objectFit: 'fill'
            }}
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            style={{
              width: '100%',
              height: '100%',
              background: 'none',
              border: 'none',
              padding: '0 15px',
              position: 'relative',
              zIndex: 1,
              fontSize: '14px',
              color: '#000000'
            }}
            placeholder="Type a message..."
          />
        </div>
      </div>

      <button
        onClick={sendMessage}
        style={{
          padding: '5px 10px',
          border: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          backgroundColor: '#7cd8ef',
          cursor: 'pointer',
          minWidth: '60px',
          fontWeight: 'bold'
        }}
      >
        Send
      </button>
    </div>
  );
}

ChatWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default ChatWindow;