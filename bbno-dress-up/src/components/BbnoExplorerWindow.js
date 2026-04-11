import React, { useRef, useState, useEffect } from 'react';
import BaseWindow from './BaseWindow';

const toolbarBtn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2px 6px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
  fontSize: '10px',
  color: '#2f2a63',
  gap: '2px',
  minWidth: '40px',
};

function BbnoExplorerWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const containerRef = useRef(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // After 90° rotation: visual_width = CSS height, visual_height = CSS width.
      // Set CSS width = container height and CSS height = container width so the
      // rotated image exactly fills the container. object-fit:contain handles AR.
      setImgSize({ w: height, h: width });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <BaseWindow
      title="bbno$ Explorer"
      onClose={onClose}
      id={id}
      zIndex={zIndex}
      isMinimized={isMinimized}
      onMinimize={onMinimize}
      onRestore={onRestore}
      onBringToFront={onBringToFront}
      initialWidth={420}
      initialHeight={560}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#7cd8ef',
        fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
        fontSize: '11px',
      }}>

        {/* Menu bar */}
        <div style={{
          display: 'flex',
          gap: '0px',
          padding: '2px 4px 0px',
          borderBottom: '2px solid',
          borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
          backgroundColor: '#7cd8ef',
          flexShrink: 0,
        }}>
          {['File', 'Edit', 'View', 'Favorites', 'Help'].map(m => (
            <button key={m} style={{
              background: 'none', border: 'none', cursor: 'default',
              padding: '1px 8px', fontSize: '11px',
              fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
              color: '#2f2a63',
            }}>{m}</button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '3px 4px',
          borderBottom: '2px solid',
          borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
          backgroundColor: '#7cd8ef',
          gap: '2px',
          flexShrink: 0,
        }}>
          <button style={toolbarBtn}>
            <span style={{ fontSize: '14px' }}>◀</span>
            Back
          </button>
          <button style={toolbarBtn}>
            <span style={{ fontSize: '14px' }}>▶</span>
            Forward
          </button>
          <button style={toolbarBtn}>
            <span style={{ fontSize: '14px' }}>⬆</span>
            Up
          </button>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#bfbaf5', margin: '0 4px', opacity: 0.5 }} />
          <button style={toolbarBtn}>
            <span style={{ fontSize: '14px' }}>🔍</span>
            Search
          </button>
          <button style={toolbarBtn}>
            <span style={{ fontSize: '14px' }}>📁</span>
            Folders
          </button>
        </div>

        {/* Address bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '3px 6px',
          gap: '6px',
          borderBottom: '2px solid',
          borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
          backgroundColor: '#7cd8ef',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#e0d0ff' }}>Address</span>
          <div style={{
            flex: 1,
            border: '2px solid',
            borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63',
            backgroundColor: '#fff',
            padding: '1px 4px',
            fontSize: '11px',
            color: '#2f2a63',
            display: 'flex',
            alignItems: 'center',
          }}>
            bbno$://wardrobe/
          </div>
          <button style={{
            padding: '2px 10px',
            border: '2px solid',
            borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
            backgroundColor: '#7cd8ef',
            color: '#2f2a63',
            fontSize: '11px',
            fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
            cursor: 'pointer',
          }}>Go</button>
        </div>

        {/* Character display */}
        <div ref={containerRef} style={{
          flex: 1,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <img
            src={process.env.PUBLIC_URL + '/assets/base/bbno-base.svg'}
            alt="bbno$"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: imgSize.w || '100%',
              height: imgSize.h || 'auto',
              maxWidth: 'none',
              objectFit: 'contain',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              transformOrigin: 'center center',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Status bar */}
        <div style={{
          padding: '3px 8px',
          borderTop: '2px solid',
          borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
          backgroundColor: '#7cd8ef',
          color: '#2f2a63',
          fontSize: '11px',
          display: 'flex',
          gap: '16px',
          flexShrink: 0,
        }}>
          <span>1 object(s)</span>
          <span>bbno$ wardrobe</span>
        </div>
      </div>
    </BaseWindow>
  );
}

export default BbnoExplorerWindow;
