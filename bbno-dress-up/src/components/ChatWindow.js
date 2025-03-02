import React, { useState, useRef, useEffect } from 'react';  
import PropTypes from 'prop-types';  
import { useWindowContext } from '../contexts/WindowContext';

function ChatWindow({ onClose, id }) {  
  const { setChatWindowOpen } = useWindowContext();
  
  // Use refs to directly manipulate DOM
  const windowRef = useRef(null);
  const [messages, setMessages] = useState([  
    { sender: 'System', text: 'Welcome to bbno$ Chat!' },  
    { sender: 'bbno$', text: 'hey, what\'s up!' }  
  ]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [maximizeState, setMaximizeState] = useState(0); // 0=normal, 1=large, 2=fullscreen
  // Add near your other state declarations
  const [scrollPosition, setScrollPosition] = useState(0);
  const messagesContainerRef = useRef(null);
  // Store original dimensions
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [resizing, setResizing] = useState(false);
const [resizeDirection, setResizeDirection] = useState('');
const [startResizePos, setStartResizePos] = useState({ x: 0, y: 0 });
const [startResizeDims, setStartResizeDims] = useState({ width: 0, height: 0 });

  // Function to scroll up
  const scrollUp = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop -= 20;
    }
  };
  
  // Function to scroll down
  const scrollDown = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop += 20;
    }
  };

  // Setup drag functionality
  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;
    
    // Save original dimensions once on first render
    if (!originalDimensions) {
      const rect = windowElement.getBoundingClientRect();
      setOriginalDimensions({
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top
      });
    }
    
    let isDragging = false;
    let offsetX, offsetY;
    
    // Drag handlers
    const handleMouseDown = (e) => {
        if (maximizeState === 2) return; // Don't allow dragging in fullscreen
        
        // Only allow dragging from title bar
        const rect = windowElement.getBoundingClientRect();
        if (e.clientY - rect.top > 25) return;
        
        isDragging = true;
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.preventDefault();
        
        // Add a class to indicate dragging is happening
        document.body.style.cursor = 'move';
      };
      
      const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        
        // Constrain to viewport
        const maxX = window.innerWidth - windowElement.offsetWidth;
        const maxY = window.innerHeight - windowElement.offsetHeight;
        
        windowElement.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
        windowElement.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
      };
      
      const handleMouseUp = () => {
        if (isDragging) {
          isDragging = false;
          document.body.style.cursor = 'default';
        }
      };
    
    // Add event listeners
    windowElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup
    return () => {
      windowElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [maximizeState, originalDimensions]);
  
  // ADD NEW useEffect HERE FOR SCROLLBAR POSITION
  useEffect(() => {
    const messagesEl = messagesContainerRef.current;
    if (!messagesEl) return;
    
    const updateThumbPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      
      // If content is smaller than container, keep thumb at top
      if (scrollHeight <= clientHeight) {
        setScrollPosition(0);
        return;
      }
      
      // Calculate how far down the scroll is (as a percentage)
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight));
      
      // Calculate maximum position for thumb (leaves room for thumb size)
      const trackHeight = messagesEl.parentElement.clientHeight - 32; // Subtract space for buttons
      const thumbHeight = 30; // Height of the thumb
      const maxScrollPosition = (trackHeight - thumbHeight) / trackHeight * 100;
      
      // Set new position
      const newPosition = Math.min(scrollPercent * 100, maxScrollPosition);
      setScrollPosition(newPosition);
    };
    
    // Update initially
    updateThumbPosition();
    
    // Update on scroll
    messagesEl.addEventListener('scroll', updateThumbPosition);
    
    return () => messagesEl.removeEventListener('scroll', updateThumbPosition);
  }, [messages]); // Re-run when messages change
  
  // Setup resize functionality
useEffect(() => {
    if (maximizeState !== 0) return; // Don't allow resizing in maximized states
    
    const windowElement = windowRef.current;
    if (!windowElement) return;
    
    const handleResizeMouseMove = (e) => {
      if (!resizing) return;
      e.preventDefault();
      
      const deltaX = e.clientX - startResizePos.x;
      const deltaY = e.clientY - startResizePos.y;
      
      const minWidth = 250;
      const minHeight = 200;
      
      let newWidth = startResizeDims.width;
      let newHeight = startResizeDims.height;
      let newLeft = startResizeDims.left;
      let newTop = startResizeDims.top;
      
      // Apply changes based on resize direction
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(minWidth, startResizeDims.width + deltaX);
      }
      if (resizeDirection.includes('w')) {
        const possibleWidth = Math.max(minWidth, startResizeDims.width - deltaX);
        if (possibleWidth !== minWidth || deltaX < 0) {
          newWidth = possibleWidth;
          newLeft = startResizeDims.left + (startResizeDims.width - possibleWidth);
        }
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(minHeight, startResizeDims.height + deltaY);
      }
      if (resizeDirection.includes('n')) {
        const possibleHeight = Math.max(minHeight, startResizeDims.height - deltaY);
        if (possibleHeight !== minHeight || deltaY < 0) {
          newHeight = possibleHeight;
          newTop = startResizeDims.top + (startResizeDims.height - possibleHeight);
        }
      }
      
      windowElement.style.width = `${newWidth}px`;
      windowElement.style.height = `${newHeight}px`;
      windowElement.style.left = `${newLeft}px`;
      windowElement.style.top = `${newTop}px`;
    };
    
    const handleResizeMouseUp = () => {
      if (resizing) {
        setResizing(false);
        document.body.style.cursor = 'default';
      }
    };
    
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [resizing, resizeDirection, startResizePos, startResizeDims, maximizeState]);

  // Maximize function using direct DOM manipulation
  const handleMaximize = () => {
    const windowElement = windowRef.current;
    if (!windowElement) return;
    
    // Save original position and size if not saved
    if (!originalDimensions) {
      const rect = windowElement.getBoundingClientRect();
      setOriginalDimensions({
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top
      });
    }
    
    if (maximizeState === 0) {
      // Go to larger state (80% of screen)
      const width = Math.min(800, window.innerWidth * 0.8);
      const height = Math.min(600, window.innerHeight * 0.8);
      
      windowElement.style.width = `${width}px`;
      windowElement.style.height = `${height}px`;
      windowElement.style.left = `${(window.innerWidth - width) / 2}px`;
      windowElement.style.top = `${(window.innerHeight - height) / 2}px`;
      
      setMaximizeState(1);
    } 
    else if (maximizeState === 1) {
      // Go to fullscreen
      windowElement.style.width = `${window.innerWidth}px`;
      windowElement.style.height = `${window.innerHeight}px`;
      windowElement.style.left = '0';
      windowElement.style.top = '0';
      
      setMaximizeState(2);
    } 
    else {
      // Return to original size
      windowElement.style.width = `${originalDimensions.width}px`;
      windowElement.style.height = `${originalDimensions.height}px`;
      windowElement.style.left = `${originalDimensions.x}px`;
      windowElement.style.top = `${originalDimensions.y}px`;
      
      setMaximizeState(0);
    }
  };
  
  const handleMinimize = () => {
    setIsMinimized(true);
  };
  
  const handleRestore = () => {
    setIsMinimized(false);
  };
  
  // Chat functionality
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
  
  // Resize handler for when mouse button is pressed
const handleResizeMouseDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    setResizing(true);
    setResizeDirection(direction);
    setStartResizePos({ x: e.clientX, y: e.clientY });
    
    const rect = windowRef.current.getBoundingClientRect();
    setStartResizeDims({
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top
    });
    
    document.body.style.cursor = 
      direction === 'se' ? 'nwse-resize' : 
      direction === 'sw' ? 'nesw-resize' :
      direction === 'ne' ? 'nesw-resize' :
      direction === 'nw' ? 'nwse-resize' :
      direction === 'n' ? 'ns-resize' :
      direction === 's' ? 'ns-resize' :
      direction === 'e' ? 'ew-resize' :
      'ew-resize';
  };
  
  // Function to render all resize handles
  const renderResizeHandles = () => {
    if (maximizeState !== 0) return null;
    
    const handleStyles = {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 9999
    };
    
    return (
      <>
        {/* Corner handles */}
        <div
          style={{...handleStyles, top: 0, left: 0, width: '10px', height: '10px', cursor: 'nwse-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
        />
        <div
          style={{...handleStyles, top: 0, right: 0, width: '10px', height: '10px', cursor: 'nesw-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
        />
        <div
          style={{...handleStyles, bottom: 0, left: 0, width: '10px', height: '10px', cursor: 'nesw-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
        />
        <div
          style={{...handleStyles, bottom: 0, right: 0, width: '10px', height: '10px', cursor: 'nwse-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
        />
        
        {/* Edge handles */}
        <div
          style={{...handleStyles, top: 0, left: '10px', right: '10px', height: '4px', cursor: 'ns-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
        />
        <div
          style={{...handleStyles, bottom: 0, left: '10px', right: '10px', height: '4px', cursor: 'ns-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 's')}
        />
        <div
          style={{...handleStyles, left: 0, top: '10px', bottom: '10px', width: '4px', cursor: 'ew-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
        />
        <div
          style={{...handleStyles, right: 0, top: '10px', bottom: '10px', width: '4px', cursor: 'ew-resize'}}
          onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
        />
      </>
    );
  };

  // If minimized, just return a small bar
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '10px',
          bottom: '40px',
          width: '150px',
          height: '30px',
          backgroundColor: '#7cd8ef',
          border: '2px solid',
          borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          cursor: 'pointer',
          zIndex: 10
        }}
        onClick={handleRestore}
      >
        <span>bbno$ Chat</span>
        <button
  onClick={(e) => {
    e.stopPropagation();
    setChatWindowOpen(false);
    onClose(id);
  }}
  style={{
    width: '16px',
    height: '14px',
    padding: 0,
    background: '#6a88c2',
    border: '1px solid #2f2a63',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <img 
    src={process.env.PUBLIC_URL + '/assets/windows/CloseButton.svg'} 
    alt="Close" 
    width="8" 
    height="8"
    style={{ filter: 'brightness(0) saturate(100%) invert(12%) sepia(71%) saturate(2052%) hue-rotate(224deg) brightness(93%) contrast(95%)' }} 
  />
</button>
      </div>
    );
  }
  
  return (
    <div
      ref={windowRef}
      style={{
        position: 'absolute',
        left: '100px',
        top: '100px',
        width: '350px',
        height: '300px',
        zIndex: maximizeState === 2 ? 9999 : 1000,
        overflow: 'hidden',
        backgroundColor: maximizeState === 2 ? '#7cd8ef' : 'transparent'
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
      
      {renderResizeHandles()}

      <div
        style={{
          height: '25px',
          cursor: maximizeState === 2 ? 'default' : 'move',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 5px',
          color: '#ffffff',
          userSelect: 'none',
          position: 'relative'
        }}
      >
        <span style={{ flex: 1 }}>bbno$ Chat</span>
        
        {/* Window control buttons */}
        <div style={{ 
          display: 'flex', 
          position: 'absolute', 
          top: '4px',
          right: '15px',
          gap: '4px'
        }}>
          {/* Minimize button */}
          <div style={{ 
            position: 'relative', 
            width: '14px', 
            height: '14px',
            backgroundColor: '#6a88c2',
            border: '2px solid',
            borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
            boxSizing: 'border-box',
            boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
          }}>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <img 
    src={process.env.PUBLIC_URL + '/assets/windows/MinimizeButton.svg'} 
    alt="Minimize" 
    width="8" 
    height="8"
    style={{ filter: 'brightness(0) saturate(100%) invert(12%) sepia(71%) saturate(2052%) hue-rotate(224deg) brightness(93%) contrast(95%)' }}
  />
</button>
          </div>

          {/* Maximize button */}
          <div style={{ 
            position: 'relative', 
            width: '14px', 
            height: '14px',
            backgroundColor: '#6a88c2',
            border: '2px solid',
            borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
            boxSizing: 'border-box',
            boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
          }}>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
<img 
  src={process.env.PUBLIC_URL + '/assets/windows/MaximizeButton.svg'} 
  alt="Maximize" 
  width="8" 
  height="8"
  style={{ filter: 'brightness(0) saturate(100%) invert(12%) sepia(71%) saturate(2052%) hue-rotate(224deg) brightness(93%) contrast(95%)' }}
/>
</button>
          </div>

          {/* Close button */}
          <div style={{ 
            position: 'relative', 
            width: '14px', 
            height: '14px',
            backgroundColor: '#6a88c2',
            border: '2px solid',
            borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
            boxSizing: 'border-box', 
            boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
          }}>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
<img 
  src={process.env.PUBLIC_URL + '/assets/windows/CloseButton.svg'} 
  alt="Close" 
  width="8" 
  height="8"
  style={{ filter: 'brightness(0) saturate(100%) invert(12%) sepia(71%) saturate(2052%) hue-rotate(224deg) brightness(93%) contrast(95%)' }} 
/>
</button>
          </div>
        </div>
      </div>

      {/* Messages area with space for scrollbar */}
      <div style={{
  position: 'absolute',
  top: '25px',
  left: '0',
  right: '0',
  bottom: '80px',
  margin: '10px 15px 10px 10px', // Adjust right margin to match exit button (15px)
  display: 'flex',
  gap: '5px',
  paddingRight: '0px' // Remove padding as we're using margin instead
}}>
  {/* Message content area */}
  <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: 0,
    border: 'none'
  }}>
  <img
    src={process.env.PUBLIC_URL + '/assets/windows/TextBox.svg'}
    alt="Text Box"
    style={{
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      width: 'calc(100% + 4px)',
      height: 'calc(100% + 4px)',
      pointerEvents: 'none',
      objectFit: 'fill',
      zIndex: 0
    }}
  />
  
  {/* Four separate border edges for perfect control */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: '#bfbaf5', // Light purple - top edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: '#2f2a63', // Dark purple - bottom edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#bfbaf5', // Light purple - left edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
  <div style={{
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#2f2a63', // Dark purple - right edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
          <div 
            ref={messagesContainerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'auto',
              padding: '10px',
              zIndex: 1,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
  marginBottom: '8px',
  color: '#5d496a',
  fontSize: '14px',
  lineHeight: '1.2',
  wordBreak: 'break-word',
  overflowWrap: 'break-word'
}}
              >
                <strong style={{ 
                  color: '#5d496a',
                  marginRight: '4px' 
                }}>
                  {msg.sender}:
                </strong> 
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Scrollbar container */}
        <div style={{
    width: '16px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginRight: '0px'
  }}>
          {/* Up arrow button */}
          <div 
            onClick={scrollUp}
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '6px solid #2f2a63',
                marginTop: '-2px'
              }}
            />
          </div>
          
          {/* Scrollbar track */}
          <div style={{
            flex: 1,
            width: '16px',
            position: 'relative',
            backgroundColor: '#7cd8ef',
            border: '2px solid',
            borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63',
            boxSizing: 'border-box',
            margin: '1px 0',
            backgroundImage: 'radial-gradient(#5d496a 1px, transparent 1px)',
            backgroundSize: '3px 3px',
            backgroundPosition: '0px 0px',
          }}>
            {/* Scrollbar thumb */}
            <div style={{
              position: 'absolute',
              top: `${scrollPosition}%`,
              left: '0',
              width: '12px',
              height: '30px',
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}>
            </div>
          </div>
          
          {/* Down arrow button */}
          <div 
            onClick={scrollDown}
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '6px solid #2f2a63',
                marginBottom: '-2px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Input area */}
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
  boxSizing: 'border-box',
  overflow: 'hidden',
  padding: 0,
  border: 'none' // Remove any border
}}>
  <img
    src={process.env.PUBLIC_URL + '/assets/windows/TextBox.svg'}
    alt="Text Box"
    style={{
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      width: 'calc(100% + 4px)',
      height: 'calc(100% + 4px)',
      pointerEvents: 'none',
      objectFit: 'fill',
      zIndex: 0
    }}
  />
  
  {/* Four separate border edges for perfect control */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: '#bfbaf5', // Light purple - top edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: '#2f2a63', // Dark purple - bottom edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#bfbaf5', // Light purple - left edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
  <div style={{
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: '#2f2a63', // Dark purple - right edge
    zIndex: 2,
    pointerEvents: 'none'
  }}></div>
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
              color: '#5d496a',
              '::placeholder': {
                color: '#5d496a88'
              }
            }}
            placeholder="Type a message..."
          />
        </div>
      </div>

      <button
  onClick={sendMessage}
  style={{
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    padding: '5px 10px',
    border: '2px solid',
    borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
    backgroundColor: '#7cd8ef',
    cursor: 'pointer',
    minWidth: '60px',
    fontWeight: 'bold',
    color: '#5d496a',
    fontSize: '14px',
    lineHeight: '1.2',
    boxShadow: 'inset -1px -1px 0 #2f2a63',
    userSelect: 'none',
    outline: 'none'
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