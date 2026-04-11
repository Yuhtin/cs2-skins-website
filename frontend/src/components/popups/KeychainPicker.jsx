import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../ui/Input';

let CATALOG_CACHE = null;
async function loadKeychains() {
  if (CATALOG_CACHE) return CATALOG_CACHE;
  const res = await fetch('/data/keychains_en.json');
  CATALOG_CACHE = await res.json();
  return CATALOG_CACHE;
}

export function KeychainPicker({ open, onClose, onPick }) {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (open) loadKeychains().then(setCatalog);
  }, [open]);

  const filtered = useMemo(() => {
    if (!search) return catalog;
    const q = search.toLowerCase();
    return catalog.filter((k) => (k.name || '').toLowerCase().includes(q));
  }, [catalog, search]);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[80vh] bg-elevated border border-subtle rounded-xl shadow-elevated z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <Dialog.Title className="font-display font-bold text-xl">
              {t('popup.keychain_title')}
            </Dialog.Title>
            <Dialog.Close className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="p-4 border-b border-subtle grid grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('popup.keychain_search')}
                className="pl-9"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[10px] text-faint uppercase mb-1">{t('popup.offset_x')}</label>
              <Input
                type="number"
                value={offsetX}
                onChange={(e) => setOffsetX(parseFloat(e.target.value || '0'))}
                className="w-20 tabular"
              />
            </div>
            <div>
              <label className="block text-[10px] text-faint uppercase mb-1">{t('popup.offset_y')}</label>
              <Input
                type="number"
                value={offsetY}
                onChange={(e) => setOffsetY(parseFloat(e.target.value || '0'))}
                className="w-20 tabular"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-6 gap-3">
              {filtered.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => {
                    onPick({ id: k.id, offsetX, offsetY });
                    onClose();
                  }}
                  className="aspect-square bg-bg border border-subtle rounded-md p-2 hover:border-accent transition-colors"
                  title={k.name}
                >
                  <img
                    src={k.image}
                    alt={k.name}
                    className="w-full h-full object-contain"
                    draggable={false}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
