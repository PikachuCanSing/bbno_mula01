import React, { useState, useRef, useEffect } from 'react';  
import PropTypes from 'prop-types';  
import { useWindowContext } from '../contexts/WindowContext';
import { useAwayMessage } from '../contexts/AwayMessageContext';

function ChatWindow({ onClose, id }) {  
    const { setChatWindowOpen } = useWindowContext();
    const { setShowAwayMessageWindow } = useAwayMessage();
    
    // Use refs to directly manipulate DOM
    const windowRef = useRef(null);
    const [messages, setMessages] = useState([  
      { sender: 'System', text: 'Welcome to bbno$ Chat!' },  
      { sender: 'bbno$', text: 'hey, what\'s up!' }  
    ]);
    const [responseOptions, setResponseOptions] = useState([
        "That's cool!",
        "Tell me more",
        "I disagree",
        "Let's change the subject"
      ]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [maximizeState, setMaximizeState] = useState(0); // 0=normal, 1=large, 2=fullscreen
    const [scrollPosition, setScrollPosition] = useState(0);
    const messagesContainerRef = useRef(null);
    
    // Reset these animation states
    const [originalDimensions, setOriginalDimensions] = useState(null);
    const [resizing, setResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState('');
    const [startResizePos, setStartResizePos] = useState({ x: 0, y: 0 });
    const [startResizeDims, setStartResizeDims] = useState({ width: 0, height: 0 });
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(true);
    const [minimizing, setMinimizing] = useState(false);
    const [minimizePosition, setMinimizePosition] = useState({ x: 0, y: 0 });
    const [fontFamily, setFontFamily] = useState('"Tahoma", "MS Sans Serif", "Arial", sans-serif');
    const [textColor, setTextColor] = useState('#5d496a'); // Default purple
    const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [isDraggingThumb, setIsDraggingThumb] = useState(false);

    // animation useEffect:
useEffect(() => {
    // Start with opening animation
    setIsOpening(true);
    
    // After a short delay, finish the animation
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFormatChange = (type, value) => {
    if (type === 'font') {
      setFontFamily(value);
      setIsFontMenuOpen(false);
    } else if (type === 'color') {
      setTextColor(value);
      setIsColorMenuOpen(false);
    } else if (type === 'bold') {
      setIsBold(!isBold);
      setIsStyleMenuOpen(false);
    } else if (type === 'italic') {
      setIsItalic(!isItalic);
      setIsStyleMenuOpen(false);
    } else if (type === 'underline') {
      setIsUnderlined(!isUnderlined);
      setIsStyleMenuOpen(false);
    }
  };

  const openBuddyList = () => {
    // Implementation for opening buddy list
    console.log("Opening buddy list");
    // You can add more functionality here
  };
  
  const openAwayMessageWindow = () => {
    setShowAwayMessageWindow(true);
  };

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

  const handleThumbMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault(); // Add this to prevent default behavior
    setIsDraggingThumb(true);
    
    // This prevents the event from bubbling up to parent handlers
    e.nativeEvent.stopImmediatePropagation();
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
    let offsetX = 0;
    let offsetY = 0;
    
    // Drag handlers with simplified logic
    const handleMouseDown = (e) => {
        if (maximizeState === 2) return; // Don't allow dragging in fullscreen
        
        // Check if we clicked on an interactive element (button, input, etc.)
        // These elements should not initiate dragging
        const target = e.target;
        if (
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'IMG' ||
          target.closest('button') ||
          e.target.closest('[data-no-drag="true"]') ||
          e.target.closest('.scrollbar-track') ||  // Changed from .scrollbar to .scrollbar-track
          e.target.closest('[data-scrollbar-thumb="true"]') || // Add specific check for thumb
          e.target.classList.contains('scrollbar-thumb') // Alternative check
        ) {
          return; // Don't start dragging when clicking on these elements
        }
        
        isDragging = true;
        const rect = windowElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.preventDefault();
        
        // Bring window to front
        windowElement.style.zIndex = '10000';
        
        // Prevent page scrolling during drag
        document.body.style.overflow = 'hidden';
        document.body.style.cursor = 'move';
      };
      
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      // Simple position calculation - no boundary checking during drag
      windowElement.style.left = `${e.clientX - offsetX}px`;
      windowElement.style.top = `${e.clientY - offsetY}px`;
    };
      
    const handleMouseUp = (e) => {
      if (!isDragging) return;
      
      // Apply gentle constraints when releasing
      const rect = windowElement.getBoundingClientRect();
      
      // Make sure window is somewhat visible
      const minLeft = -rect.width + 60;
      const maxLeft = window.innerWidth - 60;
      const minTop = -rect.height + 30;
      const maxTop = window.innerHeight - 30;
      
      // Apply constraints
      const constrainedLeft = Math.max(minLeft, Math.min(rect.left, maxLeft));
      const constrainedTop = Math.max(minTop, Math.min(rect.top, maxTop));
      
      windowElement.style.left = `${constrainedLeft}px`;
      windowElement.style.top = `${constrainedTop}px`;
      
      // Clean up
      document.body.style.overflow = '';
      document.body.style.cursor = 'default';
      isDragging = false;
    };
    
    // Global mouseup handler to recover from any stuck states
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.overflow = '';
        document.body.style.cursor = 'default';
      }
    };
    
    // Add event listeners
    windowElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
    window.addEventListener('blur', handleGlobalMouseUp);
    
    // Cleanup
    return () => {
      windowElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
      window.removeEventListener('blur', handleGlobalMouseUp);
    };
  }, [maximizeState, originalDimensions]);
  
  // Scrollbar position tracking
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
    if (maximizeState === 2) return; // Only disable resizing in full-screen mode
    
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

  // Add drag functionality for scrollbar thumb
useEffect(() => {
    if (!isDraggingThumb) return;
    
    const handleMouseMove = (e) => {
      const messagesEl = messagesContainerRef.current;
      if (!messagesEl) return;
      
      // Get the track element
      const trackElement = document.querySelector('.scrollbar-track');
      if (!trackElement) return;
      
      const trackRect = trackElement.getBoundingClientRect();
      
      // Calculate relative position in the track (0 to 1)
      const relativePos = Math.max(0, Math.min(1, 
        (e.clientY - trackRect.top) / trackRect.height));
      
      // Calculate and set scroll position
      const scrollHeight = messagesEl.scrollHeight;
      const clientHeight = messagesEl.clientHeight;
      
      if (scrollHeight <= clientHeight) return;
      messagesEl.scrollTop = relativePos * (scrollHeight - clientHeight);
    };
    
    const handleMouseUp = () => {
      setIsDraggingThumb(false);
      document.body.style.userSelect = '';
    };
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDraggingThumb]);

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
  // Get current position of window
  const rect = windowRef.current.getBoundingClientRect();
  
  // Set target position
  setMinimizePosition({ 
    x: rect.left, 
    y: rect.top 
  });
  
  // Start animation
  setMinimizing(true);
  
  // After animation completes, actually minimize
  setTimeout(() => {
    setMinimizing(false);
    setIsMinimized(true);
  }, 200);
};

// WITH this animated version:
const handleClose = () => {
    // Start the closing animation
    setIsClosing(true);
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setChatWindowOpen(false);
      onClose(id);
    }, 150);
  };
  
  // Add the handleRestore function here
  const handleRestore = () => {
    setIsMinimized(false);
  };

  // Chat functionality
  const sendMessage = (messageText) => {
    if (!messageText || messageText.trim() === '') return;
    
    setMessages([...messages, { sender: 'You', text: messageText }]);
    
    // Generate a response based on what was selected
    setTimeout(() => {
      let response;
      
      // Different responses based on what the user selected
      if (messageText.includes("cool")) {
        response = "Yeah, I know right? 🔥";
      } else if (messageText.includes("more")) {
        response = "What else do you want to know about me?";
      } else if (messageText.includes("disagree")) {
        response = "That's your opinion I guess...";
      } else {
        response = "Sure, what's up?";
      }
      
      setMessages(prev => [...prev, {
        sender: 'bbno$',
        text: response
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
    if (maximizeState === 2) return null; // Only hide resize handles in fullscreen mode
    
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
    onClick={(e) => {
      e.stopPropagation();
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
    );
  }
  
  return (
    <div
  ref={windowRef}
  style={{
    position: 'fixed',
    left: '100px',
    top: '100px',
    width: '400px',  // Increased from 350px
    height: '350px', // Increased from 300px
    zIndex: 10000,
    overflow: 'hidden',
    backgroundColor: '#7cd8ef',
    border: '2px solid #000000',
    transition: 'transform 150ms, opacity 150ms',
    transform: isOpening || isClosing ? 'scale(0.9)' : 
              minimizing ? `translate(0, ${window.innerHeight - 100}px)` : 
              'scale(1)',
    opacity: isClosing ? 0.7 : 1,
  }}
>
      
      {renderResizeHandles()}

      <div
  style={{
    height: '25px',
    cursor: maximizeState === 2 ? 'default' : 'move',
    width: '100%',
    backgroundColor: '#6a88c2',  // Changed from #aeb8db to #6a88c2
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px',
    color: '#ffffff',
    userSelect: 'none',
    position: 'relative',
    // Updated beveled border styling to match new color
    borderBottom: '2px solid #4a68a2',  // Darker shade for bottom
    borderRight: '2px solid #4a68a2',   // Darker shade for right
    borderTop: '2px solid #8aa8e2',     // Lighter shade for top
    borderLeft: '2px solid #8aa8e2',    // Lighter shade for left
    boxSizing: 'border-box'
  }}
>
<span style={{ 
  flex: 1, 
  fontFamily: '"Tahoma", "MS Sans Serif", "Arial", sans-serif', // Classic Windows fonts
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#e0d0ff', // Changed from #ffffff to match button text color
  letterSpacing: '1px',
  paddingLeft: '5px'
}}>Chat</span>



        
        {/* Window control buttons */}
        <div style={{ 
  display: 'flex', 
  position: 'absolute', 
  top: '4px',
  right: '5px',  // Changed from 30px to 5px to move closer to right edge
  gap: '4px',
  zIndex: 5
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
  onClick={handleClose}  // Change this line from the inline function to handleClose
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
  bottom: '115px', // Increased from 95px to make message area shorter
  margin: '10px 15px 10px 10px',
  display: 'flex',
  gap: '5px',
  paddingRight: '0px'
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
      color: msg.sender === 'You' ? textColor : 
             msg.sender === 'System' ? '#CC00CC' : // Changed from #666666 to bright magenta
             '#5d496a',
      fontSize: '14px',
      lineHeight: '1.2',
      fontFamily: msg.sender === 'You' ? fontFamily : 'inherit',
      fontWeight: msg.sender === 'You' && isBold ? 'bold' : 'normal',
      fontStyle: msg.sender === 'You' && isItalic ? 'italic' : 'normal',
      textDecoration: msg.sender === 'You' && isUnderlined ? 'underline' : 'none',
      wordBreak: 'break-word',
      overflowWrap: 'break-word'
    }}
  >
    <strong style={{ 
      color: msg.sender === 'You' ? '#2b5797' : 
             msg.sender === 'bbno$' ? '#8a3ffc' : 
             msg.sender === 'System' ? '#CC00CC' : // Changed from #666666 to bright magenta
             '#5d496a',
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
            data-no-drag="true"
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
          <div 
  className="scrollbar-track" // Add this className
  style={{
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

  {/* Add onMouseDown to the scrollbar thumb */}
  <div 
  className="scrollbar-thumb"
  data-scrollbar-thumb="true"
  onMouseDown={handleThumbMouseDown}
  style={{
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
            data-no-drag="true"
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

       {/* Text formatting buttons between messages and responses */}
       <div style={{
  position: 'absolute',
  bottom: '105px', // Increased from 85px to match new message area position
  left: '10px',
  zIndex: 100,
  display: 'flex',
  gap: '3px'
}}>
  {/* Font button with shadow */}
  <div style={{ position: 'relative' }} data-no-drag="true">
  <button
    onClick={() => {
      setIsFontMenuOpen(!isFontMenuOpen);
      setIsColorMenuOpen(false);
      setIsStyleMenuOpen(false);
    }}
  style={{
    padding: '1px 5px',
    backgroundColor: '#6a88c2',
    border: '2px solid',
    borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
    color: '#e0d0ff',
    fontSize: '9px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  }}
>
  Font 
  <div style={{
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '6px solid #2f2a63',
    marginBottom: '-1px'
  }}/>
</button>
    
    {isFontMenuOpen && (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        width: '150px',
        backgroundColor: '#e5eaf5',
        border: '2px solid',
        borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
        zIndex: 9999,
        padding: '5px',
        boxSizing: 'border-box',
      }}>
        <div onClick={() => handleFormatChange('font', '"Tahoma", "MS Sans Serif", "Arial", sans-serif')}
            style={{ padding: '2px', cursor: 'pointer', fontFamily: '"Tahoma", "MS Sans Serif", "Arial", sans-serif', fontSize: '12px' }}>
          Tahoma
        </div>
        <div onClick={() => handleFormatChange('font', '"Comic Sans MS", cursive')}
            style={{ padding: '2px', cursor: 'pointer', fontFamily: '"Comic Sans MS", cursive', fontSize: '12px' }}>
          Comic Sans
        </div>
        <div onClick={() => handleFormatChange('font', '"Times New Roman", serif')}
            style={{ padding: '2px', cursor: 'pointer', fontFamily: '"Times New Roman", serif', fontSize: '12px' }}>
          Times New Roman
        </div>
      </div>
    )}
  </div>
  
  {/* Color button */}
  <div style={{ position: 'relative' }} data-no-drag="true">
  <button
    onClick={() => {
      setIsColorMenuOpen(!isColorMenuOpen);
      setIsFontMenuOpen(false);
      setIsStyleMenuOpen(false);
    }}
    style={{
      padding: '1px 5px',
      backgroundColor: '#6a88c2',
      border: '2px solid',
      borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
      color: '#e0d0ff',
      fontSize: '9px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}
  >
    Color 
    <div style={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '6px solid #2f2a63',
      marginBottom: '-1px'
    }}/>
  </button>
    
    {isColorMenuOpen && (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        width: '120px',
        backgroundColor: '#e5eaf5',
        border: '2px solid',
        borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
        zIndex: 9999,
        padding: '5px',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <div onClick={() => handleFormatChange('color', '#5d496a')}
              style={{ width: '16px', height: '16px', backgroundColor: '#5d496a', cursor: 'pointer', border: '1px solid #000' }}></div>
          <div onClick={() => handleFormatChange('color', '#2b5797')}
              style={{ width: '16px', height: '16px', backgroundColor: '#2b5797', cursor: 'pointer', border: '1px solid #000' }}></div>
          <div onClick={() => handleFormatChange('color', '#b31b1b')}
              style={{ width: '16px', height: '16px', backgroundColor: '#b31b1b', cursor: 'pointer', border: '1px solid #000' }}></div>
          <div onClick={() => handleFormatChange('color', '#1e7e34')}
              style={{ width: '16px', height: '16px', backgroundColor: '#1e7e34', cursor: 'pointer', border: '1px solid #000' }}></div>
          <div onClick={() => handleFormatChange('color', '#000000')}
              style={{ width: '16px', height: '16px', backgroundColor: '#000000', cursor: 'pointer', border: '1px solid #000' }}></div>
        </div>
      </div>
    )}
  </div>
  
  {/* Style button */}
  <div style={{ position: 'relative' }} data-no-drag="true">
  <button
    onClick={() => {
      setIsStyleMenuOpen(!isStyleMenuOpen);
      setIsFontMenuOpen(false);
      setIsColorMenuOpen(false);
    }}
    style={{
      padding: '1px 5px',
      backgroundColor: '#6a88c2',
      border: '2px solid',
      borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
      color: '#e0d0ff',
      fontSize: '9px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}
  >
    Style 
    <div style={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '6px solid #2f2a63',
      marginBottom: '-1px'
    }}/>
  </button>
    
    {isStyleMenuOpen && (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        width: '150px',
        backgroundColor: '#e5eaf5',
        border: '2px solid',
        borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
        zIndex: 9999,
        padding: '5px',
        boxSizing: 'border-box',
      }}>
        <div onClick={() => handleFormatChange('bold')}
            style={{ padding: '2px', cursor: 'pointer', fontSize: '12px', fontWeight: isBold ? 'normal' : 'bold' }}>
          {isBold ? '✓ Bold' : 'Bold'}
        </div>
        <div onClick={() => handleFormatChange('italic')}
            style={{ padding: '2px', cursor: 'pointer', fontSize: '12px', fontStyle: isItalic ? 'normal' : 'italic' }}>
          {isItalic ? '✓ Italic' : 'Italic'}
        </div>
        <div onClick={() => handleFormatChange('underline')}
            style={{ padding: '2px', cursor: 'pointer', fontSize: '12px', textDecoration: isUnderlined ? 'none' : 'underline' }}>
          {isUnderlined ? '✓ Underline' : 'Underline'}
        </div>
      </div>
    )}
  </div>
  </div>

      {/* Input area */}
      <div style={{
  position: 'absolute',
  bottom: '35px', // Changed from 28px to 35px - moved up 7px
  left: '0',
  right: '0',
  height: '60px', // Increased from 52px to 60px - taller response area
  margin: '0 10px',
}}>
  <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    padding: '4px', // Increased from 3px to 4px
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '4px' // Increased from 3px to 4px
  }}>
    <img
      src={process.env.PUBLIC_URL + '/assets/windows/TextBox.svg'}
      alt="Response Box"
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
      backgroundColor: '#bfbaf5',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#2f2a63',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: '#bfbaf5',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: '#2f2a63',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    
    {/* Four response buttons */}
    {responseOptions.map((response, index) => (
  <div
    key={index}
    data-no-drag="true" 
    style={{
      position: 'relative',
      padding: '0',
      backgroundColor: '#7cd8ef',
      cursor: 'pointer',
      zIndex: 1,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}
    onClick={(e) => {
      e.stopPropagation(); // Also add this
      sendMessage(response);
    }}
  >

    {/* Four separate border edges for perfect control - EXACTLY like the input area */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#bfbaf5',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#2f2a63',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: '#bfbaf5',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: '#2f2a63',
      zIndex: 2,
      pointerEvents: 'none'
    }}></div>
    
    {/* Text content with important flag to override any competing styles */}
    <span style={{
      fontWeight: 'normal',
      color: '#ffffff !important',
      fontSize: '12px',
      lineHeight: '1.2',
      userSelect: 'none',
      padding: '3px',
      zIndex: 1
    }}>
      {response}
    </span>
  </div>
))}
  </div>
</div>

{/* Buddy List and Away Message buttons - adjusted position */}
<div style={{
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  right: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  zIndex: 100
}}
data-no-drag="true"> 
    
  <button onClick={openBuddyList} style={{
    padding: '1px 5px', // Increased padding
    backgroundColor: '#6a88c2',
    border: '2px solid',
    borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
    color: '#e0d0ff',
    fontSize: '9px', // Increased from 8px back to 9px
    cursor: 'pointer',
    fontWeight: 'bold',
    height: '18px', // Increased height from 14px to 18px
    letterSpacing: '0px', // Removed negative letter spacing
    boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
  }}>Buddy List</button>
  
  <button onClick={openAwayMessageWindow} style={{
  padding: '1px 5px',
  backgroundColor: '#6a88c2',
  border: '2px solid',
  borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
  color: '#e0d0ff',
  fontSize: '9px',
  cursor: 'pointer',
  fontWeight: 'bold',
  height: '18px',
  letterSpacing: '0px',
  boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366'
}}>Set Away Message</button>
</div>

 </div>
  );
}

ChatWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default ChatWindow;