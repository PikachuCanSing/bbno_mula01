import React from 'react';
import BaseWindow from './BaseWindow';

function RecycleBinWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const menuBtn = { background: 'none', border: 'none', cursor: 'default', padding: '1px 8px', fontSize: '11px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63' };

  return (
    <BaseWindow title="Recycle Bin" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={340} initialHeight={260}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        <div style={{ display: 'flex', padding: '2px 4px 0', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['File', 'Edit', 'View', 'Help'].map(m => <button key={m} style={menuBtn}>{m}</button>)}
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ fontSize: '52px' }}>🗑️</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2f2a63' }}>Recycle Bin is Empty</div>
          <div style={{ fontSize: '11px', color: '#888' }}>No bad fits in here.</div>
        </div>
        <div style={{ padding: '2px 8px', borderTop: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', fontSize: '10px', color: '#2f2a63', flexShrink: 0 }}>
          0 object(s)
        </div>
      </div>
    </BaseWindow>
  );
}

export default RecycleBinWindow;
