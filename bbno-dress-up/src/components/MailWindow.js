import React from 'react';
import BaseWindow from './BaseWindow';

function MailWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Mail" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      {/* Content will be added later */}
    </BaseWindow>
  );
}

export default MailWindow;