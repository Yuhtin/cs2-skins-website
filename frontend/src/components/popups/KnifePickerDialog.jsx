import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../../hooks/useTranslation';
import { KNIVES } from '../../lib/weapons';
import { saveKnife } from '../../lib/api';
import { Button } from '../ui/Button';

export function KnifePickerDialog({ open, team, appliedKnife, onClose, onSaved, onEditPaint }) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const handlePick = async (knife) => {
    setIsSaving(true);
    try {
      await saveKnife({ team, knife: knife.internal });
      toast.success(t('toast.save_success'));
      onSaved();
      onClose();
    } catch (err) {
      toast.error(t('toast.save_error', { error: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[80vh] bg-elevated border border-subtle rounded-xl shadow-elevated z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <Dialog.Title className="font-display font-bold text-xl">
              {team === 'CT' ? t('equipment.knife_ct') : t('equipment.knife_t')}
            </Dialog.Title>
            <Dialog.Close className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface">
              <X size={18} />
            </Dialog.Close>
          </div>

          {appliedKnife && (
            <div className="flex items-center gap-4 p-4 border-b border-subtle bg-surface/50">
              <img
                src={appliedKnife.image}
                alt={appliedKnife.displayName}
                className="w-16 h-16 object-contain drop-shadow-lg"
                draggable={false}
              />
              <div className="flex-1">
                <p className="text-[10px] text-faint uppercase tracking-wider mb-0.5">
                  {t('editor.pick_skin')}
                </p>
                <p className="text-sm font-semibold text-fg">{appliedKnife.displayName}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onEditPaint}
              >
                <Palette size={16} />
                {t('editor.pick_skin')}
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {KNIVES.map((knife) => {
                const isCurrent = appliedKnife?.internal === knife.internal;
                return (
                  <button
                    key={knife.internal}
                    type="button"
                    onClick={() => handlePick(knife)}
                    disabled={isSaving}
                    className={
                      isCurrent
                        ? 'bg-team-bg border-2 border-team-accent rounded-md p-3 disabled:opacity-50 shadow-[0_0_20px_var(--color-team-accent-soft)]'
                        : 'bg-bg border-2 border-subtle rounded-md p-3 hover:border-accent transition-colors disabled:opacity-50'
                    }
                    title={knife.displayName}
                  >
                    <div className="aspect-[4/3] flex items-center justify-center mb-2">
                      <img
                        src={`/weapons/weapon_${knife.internal}.png`}
                        alt={knife.displayName}
                        className="max-w-full max-h-full object-contain drop-shadow-lg"
                        onError={(e) => { e.currentTarget.src = '/weapons/knife_default.png'; }}
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[11px] text-fg font-semibold truncate text-center">{knife.displayName}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
