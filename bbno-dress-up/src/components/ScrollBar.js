import React from 'react';

function ScrollBar({ orientation = 'vertical' }) {
  const isVertical = orientation === 'vertical';
  
  return (
    <div style={{
      width: isVertical ? '16px' : '100%',
      height: isVertical ? '100%' : '16px',
      backgroundColor: '#c0c0c0',
      border: '1px solid',
      borderColor: '#808080 #ffffff #ffffff #808080',
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row'
    }}>
      <button style={{
        width: isVertical ? '100%' : '16px',
        height: isVertical ? '16px' : '100%',
        border: '1px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px'
      }}>
        {isVertical ? '▲' : '◄'}
      </button>
      
      <div style={{ 
        flex: 1,
        position: 'relative',
        margin: '2px 0'
      }}>
        <div style={{
          position: 'absolute',
          [isVertical ? 'top' : 'left']: '20%',
          width: isVertical ? '100%' : '30px',
          height: isVertical ? '30px' : '100%',
          backgroundColor: '#c0c0c0',
          border: '1px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
        }}></div>
      </div>
      
      <button style={{
        width: isVertical ? '100%' : '16px',
        height: isVertical ? '16px' : '100%',
        border: '1px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px'
      }}>
        {isVertical ? '▼' : '►'}
      </button>
    </div>
  );
}

export default ScrollBar;