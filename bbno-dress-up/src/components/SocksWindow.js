import React from 'react';
import BaseWindow from './BaseWindow';

function SocksWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Socks" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      {/* Content will be added later */}
    </BaseWindow>
  );
}

export default SocksWindow;