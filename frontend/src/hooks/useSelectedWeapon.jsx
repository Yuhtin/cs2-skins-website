import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';

const SelectedWeaponContext = createContext(null);

export function SelectedWeaponProvider({ children }) {
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [dirtyFields, setDirtyFields] = useState({});

  // Mirror dirtyFields in a ref so selectWeapon can read the current value
  // without being re-created on every dirty-state change. This avoids a race
  // where handleSave calls clearDirty() → selectWeapon(null) back-to-back:
  // the setState from clearDirty hasn't flushed yet, so a closure-captured
  // `isDirty` still reads `true` and trips the confirm dialog.
  const dirtyRef = useRef(dirtyFields);
  dirtyRef.current = dirtyFields;

  const isDirty = Object.keys(dirtyFields).length > 0;

  const selectWeapon = useCallback((weapon) => {
    if (Object.keys(dirtyRef.current).length > 0) {
      const confirmed = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmed) return;
      setDirtyFields({});
      dirtyRef.current = {};
    }
    setSelectedWeapon(weapon);
  }, []);

  const markDirty = useCallback((field, value) => {
    setDirtyFields((prev) => {
      const next = { ...prev, [field]: value };
      dirtyRef.current = next;
      return next;
    });
  }, []);

  const clearDirty = useCallback(() => {
    setDirtyFields({});
    dirtyRef.current = {};
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
