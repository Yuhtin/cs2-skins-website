import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';
import { EditorPanel } from '../editor/EditorPanel';
import { useTranslation } from '../../hooks/useTranslation';

export function EditorDrawer({ loadout, onSaved }) {
  const { t } = useTranslation();
  const { selectedWeapon, selectWeapon } = useSelectedWeapon();

  const open = selectedWeapon != null;

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') selectWeapon(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, selectWeapon]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => selectWeapon(null)}
      />
      {/* Drawer */}
      <div className="relative w-full sm:w-[440px] h-full bg-elevated border-l border-subtle shadow-[-8px_0_32px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-200">
        <button
          type="button"
          onClick={() => selectWeapon(null)}
          className="absolute top-3 right-3 z-10 h-9 w-9 flex items-center justify-center rounded-md bg-surface border border-subtle text-muted hover:text-fg hover:bg-elevated transition-colors"
          aria-label={t('popup.close')}
        >
          <X size={18} />
        </button>
        <EditorPanel
          mobile={true}
          loadout={loadout}
          onSaved={onSaved}
        />
      </div>
    </div>
  );
}
