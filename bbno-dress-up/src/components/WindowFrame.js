import React from 'react';

const WindowFrame = ({ 
  children, 
  type, 
  position, 
  onClose, 
  id, 
  width = '350px',
  height = '300px'
}) => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: width,
        height: height,
        zIndex: 10
      }}
    >
      <img 
        src={`/assets/windows/${type}.svg`}
        alt={`${type} Window`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
      {children}
    </div>
  );
};

export default WindowFrame;