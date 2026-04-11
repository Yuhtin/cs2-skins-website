import { Check, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';

export function EditorFooter({ isDirty, isSaving, onSave, onRevert }) {
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-0 bg-elevated border-t border-subtle">
      <div className="flex items-center justify-center gap-3 px-3 pt-2 text-[10px] text-faint">
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-bg border border-subtle font-mono text-[9px] text-muted">Ctrl+S</kbd>
          {t('editor.save')}
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-bg border border-subtle font-mono text-[9px] text-muted">Ctrl+Z</kbd>
          {t('editor.revert')}
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-bg border border-subtle font-mono text-[9px] text-muted">Esc</kbd>
          {t('popup.close')}
        </span>
      </div>
      <div className="p-3 flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          disabled={!isDirty || isSaving}
          onClick={onRevert}
        >
          <RotateCcw size={16} />
          {t('editor.revert')}
        </Button>
        <Button
          variant="primary"
          className="flex-[2]"
          disabled={!isDirty || isSaving}
          onClick={onSave}
        >
          <Check size={16} />
          {isSaving ? t('common.loading') : t('editor.save')}
        </Button>
      </div>
    </div>
  );
}
