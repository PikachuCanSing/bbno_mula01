import React, { useState } from 'react';
import BaseWindow from './BaseWindow';

const EMAILS = [
  { id: 1, from: 'bbno$', subject: 'hey whats up', preview: 'yo open the wardrobe', date: '4/11', body: 'yo open the wardrobe and pick something out already. we got a show tonight' },
  { id: 2, from: 'manager@bbno.com', subject: 'Tour Schedule', preview: 'dates have been confirmed', date: '4/10', body: 'All tour dates confirmed. Please check your wardrobe — you are NOT wearing that again.' },
  { id: 3, from: 'fan@mail.com', subject: 'omg ur so cool', preview: 'i love lalala so much', date: '4/9', body: 'lalala is literally my most played song of all time. please never stop making music!!' },
  { id: 4, from: 'studio@records.com', subject: 'Session Tomorrow', preview: 'Studio booked 10am', date: '4/8', body: 'Studio is booked for tomorrow at 10am. Bring snacks. Last time you ate all of mine.' },
  { id: 5, from: 'bbno$', subject: 'did u see my fit', preview: 'just copped new shoes', date: '4/7', body: 'bro i just got the craziest shoes. open the shoe window and check them out' },
];

function MailWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const [selected, setSelected] = useState(EMAILS[0]);

  const menuBtn = { background: 'none', border: 'none', cursor: 'default', padding: '1px 8px', fontSize: '11px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63' };
  const toolBtn = { backgroundColor: '#7cd8ef', border: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', padding: '2px 8px', fontSize: '10px', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif', color: '#2f2a63', cursor: 'pointer' };

  return (
    <BaseWindow title="Mail" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={500} initialHeight={380}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        {/* Menu */}
        <div style={{ display: 'flex', padding: '2px 4px 0', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['File', 'Edit', 'View', 'Message', 'Help'].map(m => <button key={m} style={menuBtn}>{m}</button>)}
        </div>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '4px', padding: '3px 6px', borderBottom: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', flexShrink: 0 }}>
          {['New', 'Reply', 'Forward', 'Delete'].map(t => <button key={t} style={toolBtn}>{t}</button>)}
        </div>
        {/* Split pane */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Inbox list */}
          <div style={{ width: '180px', borderRight: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', overflowY: 'auto', backgroundColor: '#ffffff', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#7cd8ef', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', color: '#2f2a63', borderBottom: '1px solid #bfbaf5' }}>Inbox ({EMAILS.length})</div>
            {EMAILS.map(e => (
              <div key={e.id} onClick={() => setSelected(e)} style={{ padding: '4px 6px', borderBottom: '1px solid #e0e0e0', cursor: 'pointer', backgroundColor: selected?.id === e.id ? '#2f2a63' : 'transparent' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: selected?.id === e.id ? '#ffffff' : '#2f2a63', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.from}</div>
                <div style={{ fontSize: '10px', color: selected?.id === e.id ? '#e0d0ff' : '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.subject}</div>
                <div style={{ fontSize: '9px', color: selected?.id === e.id ? '#bfbaf5' : '#888' }}>{e.date}</div>
              </div>
            ))}
          </div>
          {/* Reading pane */}
          <div style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selected && <>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #e0e0e0', backgroundColor: '#f5f5ff' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2f2a63' }}>{selected.subject}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>From: {selected.from} &nbsp;·&nbsp; {selected.date}</div>
              </div>
              <div style={{ flex: 1, padding: '10px', fontSize: '12px', color: '#2f2a63', lineHeight: '1.6', overflowY: 'auto' }}>
                {selected.body}
              </div>
            </>}
          </div>
        </div>
        {/* Status */}
        <div style={{ padding: '2px 8px', borderTop: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', fontSize: '10px', color: '#2f2a63', flexShrink: 0 }}>
          {EMAILS.length} messages
        </div>
      </div>
    </BaseWindow>
  );
}

export default MailWindow;
