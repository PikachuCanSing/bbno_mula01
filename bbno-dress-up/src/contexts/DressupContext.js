import React, { createContext, useContext, useState } from 'react';

const DressupContext = createContext(null);

export function DressupProvider({ children }) {
  const [outfit, setOutfit] = useState({
    shirt: null,
    hat: null,
    jacket: null,
    pants: null,
    shoes: null,
    socks: null,
    hair: null,
    makeup: null,
    accessories: [],
  });

  const setOutfitItem = (category, item) => {
    setOutfit(prev => {
      if (category === 'accessories') {
        const current = prev.accessories;
        const exists = current.find(a => a.id === item?.id);
        if (!item) return { ...prev, accessories: [] };
        if (exists) {
          return { ...prev, accessories: current.filter(a => a.id !== item.id) };
        }
        return { ...prev, accessories: [...current, item] };
      }
      // toggle off if same item clicked again
      if (prev[category]?.id === item?.id) {
        return { ...prev, [category]: null };
      }
      return { ...prev, [category]: item };
    });
  };

  const clearOutfit = () => {
    setOutfit({
      shirt: null,
      hat: null,
      jacket: null,
      pants: null,
      shoes: null,
      socks: null,
      hair: null,
      makeup: null,
      accessories: [],
    });
  };

  return (
    <DressupContext.Provider value={{ outfit, setOutfitItem, clearOutfit }}>
      {children}
    </DressupContext.Provider>
  );
}

export function useDressupContext() {
  const ctx = useContext(DressupContext);
  if (!ctx) throw new Error('useDressupContext must be used within DressupProvider');
  return ctx;
}
