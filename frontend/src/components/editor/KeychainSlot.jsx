import { Plus, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export function KeychainSlot({ keychain, onOpenPicker, onRemove }) {
  const { t } = useTranslation();
  const raw = keychain || '0;0;0;0;0';
  const parts = raw.split(';');
  const keychainId = parseInt(parts[0] || '0', 10);
  const hasKeychain = keychainId > 0;

  return (
    <div className="p-4 border-b border-subtle">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-3">
        {t('editor.keychain_label')}
      </label>
      <div className="relative group inline-block">
        <button
          type="button"
          onClick={onOpenPicker}
          className="h-14 px-4 bg-bg border border-subtle rounded flex items-center gap-3 hover:border-accent2 transition-colors"
        >
          {hasKeychain ? (
            <>
              <img
                src={`/data/keychains/${keychainId}.png`}
                alt=""
                className="w-10 h-10 object-contain"
                draggable={false}
              />
              <span className="text-sm text-fg">Keychain #{keychainId}</span>
            </>
          ) : (
            <>
              <Plus size={18} className="text-faint" />
              <span className="text-sm text-muted">{t('editor.keychain_label')}</span>
            </>
          )}
        </button>
        {hasKeychain && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove keychain"
          >
            <X size={12} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
