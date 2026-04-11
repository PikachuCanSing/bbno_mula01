import React from 'react';
import BaseWindow from './BaseWindow';

function MusicWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Music" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={300} initialHeight={320}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#7cd8ef', padding: '16px', boxSizing: 'border-box', gap: '14px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        {/* Album art placeholder */}
        <div style={{ width: '140px', height: '140px', backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'center', color: '#bfbaf5', fontSize: '48px', lineHeight: 1 }}>🎵</div>
        </div>

        {/* Coming soon text */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2f2a63' }}>bbno$ Virtual MP Man</div>
          <div style={{ fontSize: '10px', color: '#4a68a2', marginTop: '4px' }}>coming soon...</div>
        </div>

        {/* Fake controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '0%', height: '100%', backgroundColor: '#6a88c2' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: '#2f2a63' }}>
            <span>0:00</span><span>--:--</span>
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['⏮', '⏪', '▶', '⏩', '⏭'].map(b => (
              <button key={b} disabled style={{ width: '32px', height: '28px', backgroundColor: '#7cd8ef', border: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', fontSize: '14px', color: '#2f2a63', opacity: 0.5, cursor: 'not-allowed' }}>{b}</button>
            ))}
          </div>
        </div>
      </div>
    </BaseWindow>
  );
}

export default MusicWindow;
