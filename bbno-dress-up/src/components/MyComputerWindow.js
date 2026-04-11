import React from 'react';
import BaseWindow from './BaseWindow';

const DRIVES = [
  { icon: '💾', label: '(C:)', name: 'Hard Drive', size: '69.4 GB free' },
  { icon: '💿', label: '(D:)', name: 'DVD-ROM', size: '' },
  { icon: '🌐', label: '(Z:)', name: 'Network Drive', size: '∞ GB free' },
];

function MyComputerWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const menuBtn = { background: 'none', border: 'none', cursor: 'default', padding: '1px 8px', fontSize: '11px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63' };

  return (
    <BaseWindow title="My Computer" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={380} initialHeight={300}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        <div style={{ display: 'flex', padding: '2px 4px 0', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['File', 'Edit', 'View', 'Help'].map(m => <button key={m} style={menuBtn}>{m}</button>)}
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '12px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '16px', overflowY: 'auto' }}>
          {DRIVES.map(d => (
            <div key={d.label} style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px', border: '2px solid transparent', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.border = '2px solid #2f2a63'}
              onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}
            >
              <div style={{ fontSize: '36px' }}>{d.icon}</div>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#2f2a63', textAlign: 'center' }}>{d.name}</div>
              <div style={{ fontSize: '10px', color: '#2f2a63', textAlign: 'center' }}>{d.label}</div>
              {d.size && <div style={{ fontSize: '9px', color: '#666', textAlign: 'center' }}>{d.size}</div>}
            </div>
          ))}
        </div>
        <div style={{ padding: '2px 8px', borderTop: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', fontSize: '10px', color: '#2f2a63', flexShrink: 0 }}>
          {DRIVES.length} object(s)
        </div>
      </div>
    </BaseWindow>
  );
}

export default MyComputerWindow;
