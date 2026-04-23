import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../../hooks/useTranslation';
import { getEligibleWeapons, SLOT_META } from '../../lib/loadout-prefs';

// Modal grid of weapons valid for a (team, slot) pair. Each tile shows the
// user's saved skin image (resolved from the loadout map) when present, or
// the default weapon image otherwise. Selecting a tile fires onPick(csItem)
// which the parent passes to useLoadoutPrefs.setPref.
export function LoadoutPrefsPickerDialog({
  open,
  team,
  slot,
  loadout,
  currentCsItem,
  onPick,
  onClear,
  onClose,
}) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  if (!slot) return null;

  const weapons = getEligibleWeapons(team, slot);

  const handlePick = async (weapon) => {
    setIsSaving(true);
    try {
      await onPick(weapon.csItem);
      toast.success(t('toast.save_success'));
      onClose();
    } catch (err) {
      toast.error(t('toast.save_error', { error: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setIsSaving(true);
    try {
      await onClear();
      toast.success(t('toast.save_success'));
      onClose();
    } catch (err) {
      toast.error(t('toast.save_error', { error: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  // Resolve a weapon's display image — prefer the saved skin from loadout map.
  const resolveImage = (weapon) => {
    const skinKey = `${weapon.internal}.${team === 'CT' ? 'CT' : 'T'}`;
    const skinKeyShared = weapon.team === 'both' ? `${weapon.internal}.CT` : skinKey;
    const skinRow = loadout[skinKey] || loadout[skinKeyShared];
    return {
      image: skinRow?.image || weapon.image,
      paintName: skinRow?.paint_name,
    };
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[80vh] bg-elevated border border-subtle rounded-xl shadow-elevated z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <div>
              <p className="text-[10px] text-faint uppercase tracking-wider mb-0.5">
                {t('loadout_prefs.section_title')} · {team}
              </p>
              <Dialog.Title className="font-display font-bold text-xl">
                {t(SLOT_META[slot].labelKey)}
              </Dialog.Title>
            </div>
            <div className="flex items-center gap-2">
              {currentCsItem && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSaving}
                  className="h-9 px-3 flex items-center gap-2 rounded-md text-danger hover:bg-danger/10 disabled:opacity-50 text-xs font-semibold uppercase tracking-wider"
                >
                  <Trash2 size={14} />
                  {t('loadout_prefs.clear')}
                </button>
              )}
              <Dialog.Close className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface">
                <X size={18} />
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {weapons.map((weapon) => {
                const isCurrent = Number(weapon.csItem) === Number(currentCsItem);
                const display = resolveImage(weapon);
                return (
                  <button
                    key={weapon.internal}
                    type="button"
                    onClick={() => handlePick(weapon)}
                    disabled={isSaving}
                    className={
                      isCurrent
                        ? 'bg-team-bg border-2 border-team-accent rounded-md p-3 disabled:opacity-50 shadow-[0_0_20px_var(--color-team-accent-soft)]'
                        : 'bg-bg border-2 border-subtle rounded-md p-3 hover:border-accent transition-colors disabled:opacity-50'
                    }
                    title={display.paintName || weapon.displayName}
                  >
                    <div className="aspect-[4/3] flex items-center justify-center mb-2">
                      <img
                        src={display.image}
                        alt={weapon.displayName}
                        className="max-w-full max-h-full object-contain drop-shadow-lg"
                        onError={(e) => { e.currentTarget.src = weapon.image; }}
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[11px] text-fg font-semibold truncate text-center">
                      {weapon.displayName}
                    </p>
                    {display.paintName && (
                      <p className="text-[9px] text-team-accent uppercase tracking-wider truncate text-center mt-0.5">
                        {display.paintName.split('|').slice(1).join('|').trim() || display.paintName}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            {weapons.length === 0 && (
              <p className="text-center text-faint py-12">
                {t('loadout_prefs.no_weapons')}
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
