import { X } from 'lucide-react';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';
import { EditorPanel } from './EditorPanel';

export function MobileEditorSheet({ loadout, onSaved, onOpenStickerPicker, onOpenKeychainPicker }) {
  const { selectedWeapon, selectWeapon } = useSelectedWeapon();

  if (!selectedWeapon) return null;

  return (
    <div className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm lg:hidden" onClick={() => selectWeapon(null)}>
      <div
        className="absolute bottom-0 left-0 right-0 top-[80px] bg-elevated border-t border-subtle rounded-t-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => selectWeapon(null)}
          className="absolute top-3 right-3 z-10 h-9 w-9 flex items-center justify-center rounded-md bg-surface border border-subtle"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <EditorPanel
          mobile={true}
          loadout={loadout}
          onSaved={onSaved}
          onOpenStickerPicker={onOpenStickerPicker}
          onOpenKeychainPicker={onOpenKeychainPicker}
        />
      </div>
    </div>
  );
}
