import React, { useState } from 'react';
import BaseWindow from './BaseWindow';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function CalendarWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prev = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array(daysInMonth).keys()].map((d, i) => d === null ? null : d + 1);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) => d && d === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear();

  const navBtn = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: '#2f2a63', padding: '0 8px', lineHeight: 1 };

  return (
    <BaseWindow title="Calendar" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={260} initialHeight={260}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef', padding: '6px', boxSizing: 'border-box', gap: '4px' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', paddingBottom: '4px', flexShrink: 0 }}>
          <button style={navBtn} onClick={prev}>◀</button>
          <span style={{ fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', fontWeight: 'bold', fontSize: '13px', color: '#2f2a63' }}>
            {MONTHS[view.month]} {view.year}
          </span>
          <button style={navBtn} onClick={next}>▶</button>
        </div>

        {/* Calendar grid */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', display: 'flex', flexDirection: 'column' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#7cd8ef' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: '#2f2a63', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', padding: '2px 0', borderBottom: '1px solid #bfbaf5' }}>{d}</div>
            ))}
          </div>
          {/* Date cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1 }}>
            {cells.map((d, i) => (
              <div key={i} style={{
                textAlign: 'center', fontSize: '11px',
                fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
                color: isToday(d) ? '#ffffff' : '#2f2a63',
                backgroundColor: isToday(d) ? '#2f2a63' : 'transparent',
                fontWeight: isToday(d) ? 'bold' : 'normal',
                borderRadius: isToday(d) ? '2px' : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #e0e0e0',
              }}>
                {d || ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseWindow>
  );
}

export default CalendarWindow;
