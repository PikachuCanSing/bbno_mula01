import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function BaseWindow({ title, onClose, id, children, zIndex, isMinimized = false, onMinimize, onRestore, onBringToFront }) {
  const windowRef = useRef(null);
  const [maximizeState, setMaximizeState] = useState(0); // 0=normal, 1=large, 2=fullscreen
  const [originalDimensions, setOriginalDimensions] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [startResizePos, setStartResizePos] = useState({ x: 0, y: 0 });
  const [startResizeDims, setStartResizeDims] = useState({ width: 0, height: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [minimizing, setMinimizing] = useState(false);
  const [minimizePosition, setMinimizePosition] = useState({ x: 0, y: 0 });

  // Animation useEffect
  useEffect(() => {
    setIsOpening(true);
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Setup drag functionality
  useEffect(() => {
    const windowElement = windowRef.current;
    if (!windowElement) return;

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

    const handleMouseDown = (e) => {
  if (maximizeState === 2) return;
  
  if (e.target.closest('button') || 
      e.target.closest('[data-no-drag="true"]') ||
      e.target.closest('.scrollbar-track') ||
      e.target.closest('[data-scrollbar-thumb="true"]') ||
      e.target.classList.contains('scrollbar-thumb')) {
    return;
  }

  if (onBringToFront) onBringToFront(id);

  isDragging = true;
  const rect = windowElement.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  e.preventDefault();
  document.body.style.overflow = 'visible';
  document.body.style.cursor = 'move';
};

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      windowElement.style.left = `${e.clientX - offsetX}px`;
      windowElement.style.top = `${e.clientY - offsetY}px`;
    };

    const handleMouseUp = (e) => {
      if (!isDragging) return;

      const rect = windowElement.getBoundingClientRect();
      const minLeft = -rect.width + 60;
      const maxLeft = window.innerWidth - 60;
      const minTop = -rect.height + 30;
      const maxTop = window.innerHeight - 30;

      const constrainedLeft = Math.max(minLeft, Math.min(rect.left, maxLeft));
      const constrainedTop = Math.max(minTop, Math.min(rect.top, maxTop));

      windowElement.style.left = `${constrainedLeft}px`;
      windowElement.style.top = `${constrainedTop}px`;

      document.body.style.overflow = '';
      document.body.style.cursor = 'default';
      isDragging = false;
    };

   const titlebar = windowElement.querySelector('.window-titlebar');
if (titlebar) titlebar.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
     const titlebar = windowElement.querySelector('.window-titlebar');
if (titlebar) titlebar.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [maximizeState, originalDimensions]);

  // Setup resize functionality
  useEffect(() => {
    if (maximizeState === 2) return;

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

  const handleMaximize = () => {
    const windowElement = windowRef.current;
    if (!windowElement) return;

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
      const width = Math.min(800, window.innerWidth * 0.8);
      const height = Math.min(600, window.innerHeight * 0.8);

      windowElement.style.width = `${width}px`;
      windowElement.style.height = `${height}px`;
      windowElement.style.left = `${(window.innerWidth - width) / 2}px`;
      windowElement.style.top = `${(window.innerHeight - height) / 2}px`;

      setMaximizeState(1);
    } else if (maximizeState === 1) {
      windowElement.style.width = `${window.innerWidth}px`;
      windowElement.style.height = `${window.innerHeight}px`;
      windowElement.style.left = '0';
      windowElement.style.top = '0';

      setMaximizeState(2);
    } else {
      windowElement.style.width = `${originalDimensions.width}px`;
      windowElement.style.height = `${originalDimensions.height}px`;
      windowElement.style.left = `${originalDimensions.x}px`;
      windowElement.style.top = `${originalDimensions.y}px`;

      setMaximizeState(0);
    }
  };

  const handleMinimize = () => {
    const rect = windowRef.current.getBoundingClientRect();
    setMinimizePosition({ x: rect.left, y: rect.top });
    setMinimizing(true);
    setTimeout(() => {
      setMinimizing(false);
      if (onMinimize) onMinimize(id);
    }, 200);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 150);
  };

  const handleRestore = () => {
    if (onRestore) onRestore(id);
  };

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

  const renderResizeHandles = () => {
    if (maximizeState === 2) return null;

    const handleStyles = {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 9999
    };

    return (
      <>
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
        <span>{title}</span>
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
        width: '400px',
        height: '350px',
        zIndex: zIndex,
        overflow: 'visible',
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
      className="window-titlebar"
        style={{
          height: '25px',
          cursor: maximizeState === 2 ? 'default' : 'move',
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
        }}>{title}</span>

        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '4px',
          right: '5px',
          gap: '4px',
          zIndex: 5
        }}>
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
              onClick={(e) => { e.stopPropagation(); handleMinimize(e); }}
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
              onClick={(e) => { e.stopPropagation(); handleMaximize(e); }}
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
              onClick={(e) => { e.stopPropagation(); handleClose(e); }}
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

      <div style={{
        padding: '10px',
        height: 'calc(100% - 25px)',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ margin: 0, color: '#000' }}>{title}</h2>
      </div>
    </div>
  );
}

BaseWindow.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  zIndex: PropTypes.number,
  isMinimized: PropTypes.bool,
  onMinimize: PropTypes.func,
  onRestore: PropTypes.func,
  onBringToFront: PropTypes.func
};

export default BaseWindow;