import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../ui/Input';
import { ensureGlovesCatalog, getGlovesCatalog } from '../../lib/equipment-catalogs';
import { saveGloves } from '../../lib/api';

export function GlovesPickerDialog({ open, team, onClose, onSaved }) {
  const { t } = useTranslation();
  const [catalogReady, setCatalogReady] = useState(false);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) ensureGlovesCatalog().then(() => setCatalogReady(true));
  }, [open]);

  const filtered = useMemo(() => {
    if (!catalogReady) return [];
    const all = getGlovesCatalog();
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((g) => (g.paint_name || '').toLowerCase().includes(q));
  }, [catalogReady, search]);

  const handlePick = async (glove) => {
    setIsSaving(true);
    try {
      await saveGloves({
        team,
        weapon_defindex: glove.weapon_defindex,
        paint: glove.paint,
        wear: 0.0001,
        seed: 0,
      });
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
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl h-[85vh] bg-elevated border border-subtle rounded-xl shadow-elevated z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <Dialog.Title className="font-display font-bold text-xl">
              {team === 'CT' ? t('equipment.gloves_ct') : t('equipment.gloves_t')}
            </Dialog.Title>
            <Dialog.Close className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="p-4 border-b border-subtle">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('header.search_placeholder')}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filtered.map((glove) => (
                <button
                  key={`${glove.weapon_defindex}-${glove.paint}`}
                  type="button"
                  onClick={() => handlePick(glove)}
                  disabled={isSaving}
                  className="bg-bg border-2 border-subtle rounded-md p-3 hover:border-accent transition-colors disabled:opacity-50"
                  title={glove.paint_name}
                >
                  <div className="aspect-square flex items-center justify-center mb-2">
                    <img
                      src={glove.image}
                      alt={glove.paint_name}
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[10px] text-muted truncate text-center">{glove.paint_name}</p>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-faint py-12">
                {catalogReady ? 'No gloves found' : t('common.loading')}
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
