import React, { createContext, useState, useContext } from 'react';

const WindowContext = createContext();

export function WindowProvider({ children }) {
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  
  // Add this function right here - inside the WindowProvider function
  const openChatWindow = () => {
    // Only allow opening if no window is already open
    if (!chatWindowOpen) {
      setChatWindowOpen(true);
      return true;
    }
    return false;
  };
  
  const value = {
    chatWindowOpen,
    setChatWindowOpen,
    openChatWindow  // Add this to the value object
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