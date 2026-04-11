import { createContext, useContext, useState } from 'react';

const TeamHighlightContext = createContext(null);

export function TeamHighlightProvider({ children }) {
  const [highlight, setHighlight] = useState(null); // 'CT' | 'T' | null

  return (
    <TeamHighlightContext.Provider value={{ highlight, setHighlight }}>
      {children}
    </TeamHighlightContext.Provider>
  );
}

export function useTeamHighlight() {
  const ctx = useContext(TeamHighlightContext);
  if (!ctx) throw new Error('useTeamHighlight must be used inside TeamHighlightProvider');
  return ctx;
}
