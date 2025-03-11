import React from 'react';
import './App.css';
import DressupGame from './components/DressupGame';
import { WindowProvider, useWindowContext } from './contexts/WindowContext';
import { AwayMessageProvider, useAwayMessage } from './contexts/AwayMessageContext';
import AwayMessageWindow from './components/AwayMessageWindow';
import ChatWindow from './components/Chatwindow';

function App() {
  return (
    <WindowProvider>
      <AwayMessageProvider>
        <AppContent />
      </AwayMessageProvider>
    </WindowProvider>
  );
}

// This component has access to both contexts
function AppContent() {
  const { showAwayMessageWindow } = useAwayMessage();
  const { chatWindowOpen, setChatWindowOpen } = useWindowContext();
  
  const handleCloseChat = (id) => {
    setChatWindowOpen(false);
  };
  
  return (
    <div className="App">
      <DressupGame />
      {chatWindowOpen && <ChatWindow onClose={handleCloseChat} id="main-chat" />}
      {showAwayMessageWindow && <AwayMessageWindow />}
    </div>
  );
}

export default App;