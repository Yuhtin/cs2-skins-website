import { Plus, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export function StickerSlots({ stickers, onOpenPicker, onRemove }) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-subtle">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-3">
        {t('editor.stickers_label')}
      </label>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((idx) => {
          const raw = stickers?.[idx] || '0;0;0;0;0;0;0';
          const parts = raw.split(';');
          const stickerId = parseInt(parts[0] || '0', 10);
          const hasSticker = stickerId > 0;

          return (
            <div key={idx} className="relative group">
              <button
                type="button"
                onClick={() => onOpenPicker(idx)}
                className="w-14 h-14 bg-bg border border-subtle rounded flex items-center justify-center hover:border-accent2 transition-colors"
                aria-label={`Sticker slot ${idx + 1}`}
              >
                {hasSticker ? (
                  <img
                    src={`/data/stickers/${stickerId}.png`}
                    alt=""
                    className="max-w-full max-h-full"
                    draggable={false}
                  />
                ) : (
                  <Plus size={18} className="text-faint" />
                )}
              </button>
              {hasSticker && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove sticker ${idx + 1}`}
                >
                  <X size={12} className="text-white" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
