import React, { useEffect, useState, createContext, useContext } from 'react';
type PopupContextType = {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
};
const PopupContext = createContext<PopupContextType | undefined>(undefined);
export function PopupProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  // Trigger on load (with slight delay) and every 60s
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      // Only open if not already visited/converted (mock logic)
      if (!sessionStorage.getItem('popupShown')) {
        setIsOpen(true);
        sessionStorage.setItem('popupShown', 'true');
      }
    }, 2000); // 2s delay on load
    const intervalTimer = setInterval(() => {
      // Re-trigger every 60s if user is idle or just purely based on time as requested
      // For UX, we might want to check if it's already open, but requirements say "every 60s"
      if (!isOpen) {
        setIsOpen(true);
      }
    }, 60000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isOpen]);
  return <PopupContext.Provider value={{
    isOpen,
    openPopup,
    closePopup
  }}>
      {children}
    </PopupContext.Provider>;
}
export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
}