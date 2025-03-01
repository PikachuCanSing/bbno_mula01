import React, { useState, useRef } from 'react';

function Window98({ 
  title, 
  children, 
  initialPosition = { x: 50, y: 50 }, 
  initialSize = { width: 400, height: 300 },
  onClose,
  id
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(true);
  
  const windowRef = useRef(null);
  
  // Handle dragging start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsActive(true);
    
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Handle dragging move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });
  };
  
  // Handle dragging end
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle close button
  const handleClose = () => {
    if (onClose) onClose(id);
  };
  
  return (
    <div 
      ref={windowRef}
      className="window98"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${initialSize.width}px`,
        height: `${initialSize.height}px`,
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        backgroundColor: '#c0c0c0',
        boxShadow: isActive ? '0 0 10px rgba(0, 255, 255, 0.5)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isActive ? 100 : 10
      }}
      onClick={() => setIsActive(true)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Title bar */}
      <div 
        style={{
          backgroundColor: isActive ? '#000080' : '#808080',
          color: 'white',
          padding: '2px 4px',
          fontWeight: 'bold',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move'
        }}
        onMouseDown={handleMouseDown}
      >
        <span>{title}</span>
        <div style={{ display: 'flex' }}>
          <button 
            style={{ 
              width: '16px', 
              height: '16px',
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              margin: '0 2px',
              fontSize: '10px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >_</button>
          <button 
            style={{ 
              width: '16px', 
              height: '16px',
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              margin: '0 2px',
              fontSize: '10px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >□</button>
          <button 
            style={{ 
              width: '16px', 
              height: '16px',
              backgroundColor: '#c0c0c0',
              border: '1px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              margin: '0 2px',
              fontSize: '10px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={handleClose}
          >×</button>
        </div>
      </div>
      
      {/* Window content */}
      <div 
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '5px',
          backgroundColor: '#ffffff'
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Window98;