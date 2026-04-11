import { Check, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';

export function EditorFooter({ isDirty, isSaving, onSave, onRevert }) {
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-0 bg-elevated border-t border-subtle p-3 flex gap-2">
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
  );
}
