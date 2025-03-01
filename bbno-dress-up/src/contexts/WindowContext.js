import React, { createContext, useState, useContext } from 'react';

const WindowContext = createContext();

export function WindowProvider({ children }) {
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  
  const value = {
    chatWindowOpen,
    setChatWindowOpen
  };

  return (
    <WindowContext.Provider value={value}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}