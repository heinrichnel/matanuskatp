// AppContext.tsx
import { createContext, useContext, ReactNode } from "react";

type AppContextType = {
  // definieer jou context waardes hier
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // jou state/logika hier
  return (
    <AppContext.Provider value={{ /* jou waardes */ }}>
      {children}
    </AppContext.Provider>
  );
};

// (optioneel) jou useAppContext hook:
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext moet binne AppProvider gebruik word");
  return context;
};
