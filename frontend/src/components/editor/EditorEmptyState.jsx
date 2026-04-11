import { Package } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export function EditorEmptyState() {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <Package size={64} className="text-faint mb-4" strokeWidth={1.5} />
      <h3 className="font-display font-bold text-xl text-muted mb-2">{t('editor.empty_title')}</h3>
      <p className="text-sm text-faint max-w-xs">{t('editor.empty_subtitle')}</p>
    </div>
  );
}
