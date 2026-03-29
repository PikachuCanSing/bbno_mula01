import React from 'react';

function Window({ title, children, initialWidth, initialHeight, onClose, id }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: initialWidth || 400,
        height: initialHeight || 300,
        backgroundColor: '#c0c0c0',
        border: '2px solid #000',
        zIndex: 10,
      }}
    >
      <div style={{
        backgroundColor: '#000080',
        color: 'white',
        padding: '2px 5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{title}</span>
        <button onClick={() => onClose(id)}>X</button>
      </div>
      <div style={{ padding: '10px' }}>
        {children}
      </div>
    </div>
  );
}

export default Window;