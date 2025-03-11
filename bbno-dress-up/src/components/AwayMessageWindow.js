import React, { useState, useRef, useEffect } from 'react';
import { useAwayMessage } from '../contexts/AwayMessageContext';

function AwayMessageWindow() {
  // Context
  const { awayMessage, setAwayMessage, setShowAwayMessageWindow } = useAwayMessage();
  
  // States
  const [draftMessage, setDraftMessage] = useState(awayMessage);
  const [messageOptions, setMessageOptions] = useState([
    "I'm away from my computer right now.",
    "BRB in 5 minutes",
    "Gone for lunch",
    "In a meeting"
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Refs
  const windowRef = useRef(null);
  
  // Window position state
  const [position, setPosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Handle window dragging
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
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
  
  // Handle window header mouse down
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('[data-no-drag="true"]')) return;
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };
  
  // Handle close button
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowAwayMessageWindow(false);
    }, 150);
  };
  
  // Handle save button
  const handleSave = () => {
    setAwayMessage(draftMessage);
    handleClose();
  };
  
  // Select a message from dropdown
  const selectMessage = (message) => {
    setDraftMessage(message);
    setIsDropdownOpen(false);
  };
  
  return (
    <div
      ref={windowRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '350px',
        height: '220px',
        zIndex: 10001,
        overflow: 'hidden',
        backgroundColor: '#7cd8ef',
        border: '2px solid #000000',
        transition: 'transform 150ms, opacity 150ms',
        transform: isClosing ? 'scale(0.9)' : 'scale(1)',
        opacity: isClosing ? 0 : 1,
      }}
    >
      {/* Window header */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          height: '25px',
          cursor: 'move',
          width: '100%',
          backgroundColor: '#6a88c2',
          display: 'flex',
          alignItems: 'center',
          padding: '0 5px',
          color: '#ffffff',
          userSelect: 'none',
          position: 'relative',
          borderBottom: '2px solid #4a68a2',
          borderRight: '2px solid #4a68a2',
          borderTop: '2px solid #8aa8e2',
          borderLeft: '2px solid #8aa8e2',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ 
          flex: 1, 
          fontFamily: '"Tahoma", "MS Sans Serif", "Arial", sans-serif',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#e0d0ff',
          letterSpacing: '1px',
          paddingLeft: '5px'
        }}>Set Away Message</span>
        
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
            onClick={handleClose}
            title="Close"
            data-no-drag="true"
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
      
      {/* Window content */}
      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 25px)' }}>
        <div style={{ marginBottom: '10px', fontSize: '12px' }}>Choose an away message:</div>
        
        {/* Dropdown */}
        <div style={{ position: 'relative', marginBottom: '15px' }} data-no-drag="true">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              height: '24px',
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              color: '#e0d0ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <span>{draftMessage}</span>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '6px solid #2f2a63',
              marginLeft: '10px'
            }}/>
          </div>
          
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              backgroundColor: '#e5eaf5',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              zIndex: 1000,
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {messageOptions.map((message, index) => (
                <div 
                  key={index}
                  onClick={() => selectMessage(message)}
                  style={{
                    padding: '5px 8px',
                    borderBottom: index < messageOptions.length - 1 ? '1px solid #ccc' : 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Input box */}
        <div style={{ position: 'relative', flex: '1', marginBottom: '15px' }}>
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
          <textarea
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            data-no-drag="true"
            style={{
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              backgroundColor: 'transparent',
              padding: '8px',
              boxSizing: 'border-box',
              fontSize: '12px',
              position: 'relative',
              zIndex: 1
            }}
          />
        </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={handleSave}
            data-no-drag="true"
            style={{
              padding: '3px 12px',
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              color: '#e0d0ff',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
            }}
          >
            Save
          </button>
          <button 
            onClick={handleClose}
            data-no-drag="true"
            style={{
              padding: '3px 12px',
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              color: '#e0d0ff',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AwayMessageWindow;