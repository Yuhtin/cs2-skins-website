import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const SelectedWeaponContext = createContext(null);

export function SelectedWeaponProvider({ children }) {
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [dirtyFields, setDirtyFields] = useState({});

  const isDirty = Object.keys(dirtyFields).length > 0;

  const selectWeapon = useCallback(
    (weapon) => {
      if (isDirty) {
        const confirmed = window.confirm('You have unsaved changes. Discard them?');
        if (!confirmed) return;
        setDirtyFields({});
      }
      setSelectedWeapon(weapon);
    },
    [isDirty],
  );

  const markDirty = useCallback((field, value) => {
    setDirtyFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearDirty = useCallback(() => {
    setDirtyFields({});
  }, []);

  const value = useMemo(
    () => ({ selectedWeapon, selectWeapon, dirtyFields, isDirty, markDirty, clearDirty }),
    [selectedWeapon, selectWeapon, dirtyFields, isDirty, markDirty, clearDirty],
  );

  return (
    <SelectedWeaponContext.Provider value={value}>
      {children}
    </SelectedWeaponContext.Provider>
  );
}

export function useSelectedWeapon() {
  const ctx = useContext(SelectedWeaponContext);
  if (!ctx) throw new Error('useSelectedWeapon must be used inside SelectedWeaponProvider');
  return ctx;
}
