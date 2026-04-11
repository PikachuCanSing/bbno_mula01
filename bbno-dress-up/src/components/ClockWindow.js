import React, { useState, useEffect } from 'react';
import BaseWindow from './BaseWindow';

function ClockWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = (h % 12) * 30 + m * 0.5;

  const pad = (n) => String(n).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;

  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const hand = (deg, len, width, color) => {
    const rad = (deg - 90) * Math.PI / 180;
    const cx = 80, cy = 80;
    const x2 = cx + len * Math.cos(rad);
    const y2 = cy + len * Math.sin(rad);
    return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  };

  return (
    <BaseWindow title="Clock" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={220} initialHeight={290}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#7cd8ef', gap: '8px', padding: '10px', boxSizing: 'border-box' }}>
        {/* Analog clock */}
        <div style={{ backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', borderRadius: '50%', padding: '4px' }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="78" fill="#ffffff" stroke="#2f2a63" strokeWidth="2" />
            {[...Array(12)].map((_, i) => {
              const a = (i * 30 - 90) * Math.PI / 180;
              return <line key={i} x1={80 + 62 * Math.cos(a)} y1={80 + 62 * Math.sin(a)} x2={80 + 70 * Math.cos(a)} y2={80 + 70 * Math.sin(a)} stroke="#2f2a63" strokeWidth={i % 3 === 0 ? 2.5 : 1.5} />;
            })}
            {hand(hrDeg, 42, 4, '#2f2a63')}
            {hand(minDeg, 58, 3, '#2f2a63')}
            {hand(secDeg, 62, 1.5, '#e85d9a')}
            <circle cx="80" cy="80" r="4" fill="#2f2a63" />
          </svg>
        </div>

        {/* Digital time */}
        <div style={{ backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', padding: '4px 16px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', fontSize: '22px', fontWeight: 'bold', color: '#2f2a63', letterSpacing: '2px' }}>
          {h12}:{pad(m)}:{pad(s)} {ampm}
        </div>

        {/* Date */}
        <div style={{ fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', fontSize: '12px', color: '#2f2a63', fontWeight: 'bold' }}>
          {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}, {now.getFullYear()}
        </div>
      </div>
    </BaseWindow>
  );
}

export default ClockWindow;
