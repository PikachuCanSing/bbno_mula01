import React, { createContext, useState, useContext } from 'react';

// Create the context
const AwayMessageContext = createContext();

// Create a provider component
export function AwayMessageProvider({ children }) {
  const [awayMessage, setAwayMessage] = useState("I'm away from my computer right now.");
  const [isAway, setIsAway] = useState(false);
  const [showAwayMessageWindow, setShowAwayMessageWindow] = useState(false);
  
  // Toggle away status
  const toggleAwayStatus = () => {
    setIsAway(prev => !prev);
  };
  
  // Value to be provided to consumers
  const value = {
    awayMessage,
    setAwayMessage,
    isAway,
    setIsAway,
    toggleAwayStatus,
    showAwayMessageWindow,
    setShowAwayMessageWindow
  };
  
  return (
    <AwayMessageContext.Provider value={value}>
      {children}
    </AwayMessageContext.Provider>
  );
}

// Custom hook for using the away message context
export function useAwayMessage() {
  const context = useContext(AwayMessageContext);
  if (context === undefined) {
    throw new Error('useAwayMessage must be used within an AwayMessageProvider');
  }
  return context;
}