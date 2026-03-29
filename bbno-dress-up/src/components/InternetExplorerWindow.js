import React from 'react';

function InternetExplorerWindow({ onClose, id }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 400,
        height: 300,
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
        <span>Internet Explorer</span>
        <button onClick={() => onClose(id)}>X</button>
      </div>
      <div style={{ padding: '10px' }}>
        <p>Internet Explorer placeholder</p>
      </div>
    </div>
  );
}

export default InternetExplorerWindow;