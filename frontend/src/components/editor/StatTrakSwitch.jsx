import * as Switch from '@radix-ui/react-switch';
import { useTranslation } from '../../hooks/useTranslation';

export function StatTrakSwitch({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-subtle flex items-center justify-between">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="stattrak">
        {t('editor.stattrak_label')}
      </label>
      <Switch.Root
        id="stattrak"
        checked={value}
        onCheckedChange={onChange}
        className="w-10 h-6 bg-subtle rounded-full data-[state=checked]:bg-accent relative transition-colors"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
      </Switch.Root>
    </div>
  );
}
