import { useEffect, useRef } from 'react';

// Attaches one global keydown listener that stays stable across renders.
// The shortcut map is stored in a ref so consumers can pass inline object literals
// without re-binding the listener every render.
//
// Usage:
//   useKeyboardShortcuts({
//     '/': () => focusSearchInput(),
//     'Escape': () => closeBottomSheet(),
//     'Mod+s': (e) => { e.preventDefault(); save(); },
//     'Mod+z': () => revert(),
//   });
export function useKeyboardShortcuts(shortcuts) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    function onKey(e) {
      const isMod = e.ctrlKey || e.metaKey;
      const key = e.key;
      const target = e.target;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      // Build candidate combos, most-specific first.
      const combos = [];
      if (isMod && e.shiftKey) combos.push(`Mod+Shift+${key}`);
      if (isMod) combos.push(`Mod+${key.toLowerCase()}`);
      if (e.shiftKey) combos.push(`Shift+${key}`);
      combos.push(key);

      const current = shortcutsRef.current;
      for (const combo of combos) {
        const handler = current[combo];
        if (!handler) continue;
        // Skip naked-key handlers when typing in inputs, except Escape.
        if (isInput && !combo.startsWith('Mod') && combo !== 'Escape') continue;
        handler(e);
        return;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
