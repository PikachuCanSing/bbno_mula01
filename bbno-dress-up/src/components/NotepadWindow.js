import React, { useState } from 'react';
import BaseWindow from './BaseWindow';

function NotepadWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const [text, setText] = useState('');

  const lines = text.split('\n').length;
  const chars = text.length;

  const menuBtn = { background: 'none', border: 'none', cursor: 'default', padding: '1px 8px', fontSize: '11px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63' };

  return (
    <BaseWindow title="Notepad" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={420} initialHeight={340}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef' }}>
        {/* Menu bar */}
        <div style={{ display: 'flex', padding: '2px 4px 0', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['File', 'Edit', 'Format', 'View', 'Help'].map(m => <button key={m} style={menuBtn}>{m}</button>)}
        </div>
        {/* Text area */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          data-no-drag="true"
          spellCheck={false}
          style={{
            flex: 1, resize: 'none', border: 'none', outline: 'none',
            fontFamily: '"Courier New", Courier, monospace', fontSize: '13px',
            color: '#2f2a63', backgroundColor: '#ffffff',
            padding: '4px', lineHeight: '1.5',
          }}
        />
        {/* Status bar */}
        <div style={{ padding: '2px 8px', borderTop: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', backgroundColor: '#7cd8ef', fontSize: '10px', color: '#2f2a63', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', display: 'flex', gap: '16px', flexShrink: 0 }}>
          <span>Ln {lines}</span>
          <span>Col {text.length - text.lastIndexOf('\n') - 1 || 1}</span>
          <span>{chars} chars</span>
        </div>
      </div>
    </BaseWindow>
  );
}

export default NotepadWindow;
