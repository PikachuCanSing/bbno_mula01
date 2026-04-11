import React from 'react';
import BaseWindow from './BaseWindow';

const FILES = [
  { icon: '📁', name: 'Wardrobe', type: 'File Folder' },
  { icon: '📁', name: 'Tour Stuff', type: 'File Folder' },
  { icon: '📁', name: 'Music', type: 'File Folder' },
  { icon: '📄', name: 'setlist.txt', type: 'Text Document' },
  { icon: '🖼️', name: 'promo_photo.jpg', type: 'JPEG Image' },
  { icon: '📄', name: 'rider.doc', type: 'Document' },
];

function FolderWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const menuBtn = { background: 'none', border: 'none', cursor: 'default', padding: '1px 8px', fontSize: '11px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63' };
  const toolBtn = { backgroundColor: '#7cd8ef', border: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', padding: '2px 8px', fontSize: '10px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63', cursor: 'pointer' };

  return (
    <BaseWindow title="Folder" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={400} initialHeight={320}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        <div style={{ display: 'flex', padding: '2px 4px 0', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['File', 'Edit', 'View', 'Help'].map(m => <button key={m} style={menuBtn}>{m}</button>)}
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '3px 6px', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['Back', 'Forward', 'Up'].map(t => <button key={t} style={toolBtn}>{t}</button>)}
          <div style={{ flex: 1, marginLeft: '8px', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', backgroundColor: '#fff', padding: '1px 6px', fontSize: '11px', color: '#2f2a63', display: 'flex', alignItems: 'center' }}>C:\bbno$\</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '8px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '12px', overflowY: 'auto' }}>
          {FILES.map(f => (
            <div key={f.name} style={{ width: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', padding: '4px', border: '2px solid transparent', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.border = '2px solid #2f2a63'}
              onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}
            >
              <div style={{ fontSize: '32px' }}>{f.icon}</div>
              <div style={{ fontSize: '10px', color: '#2f2a63', textAlign: 'center', wordBreak: 'break-word' }}>{f.name}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '2px 8px', borderTop: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', fontSize: '10px', color: '#2f2a63', flexShrink: 0 }}>
          {FILES.length} object(s)
        </div>
      </div>
    </BaseWindow>
  );
}

export default FolderWindow;
