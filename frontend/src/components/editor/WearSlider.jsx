import * as Slider from '@radix-ui/react-slider';
import { useTranslation } from '../../hooks/useTranslation';

export function WearSlider({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-subtle">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted">
          {t('editor.wear_label')}
        </label>
        <span className="tabular font-mono text-sm text-accent">
          {value.toFixed(3)}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center w-full h-6 select-none touch-none"
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={0}
        max={1}
        step={0.001}
        aria-label={t('editor.wear_label')}
      >
        <Slider.Track className="bg-subtle relative grow rounded-full h-2 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[7%] bg-[#5BA3FF]/40" />
          <div className="absolute inset-y-0 left-[7%] w-[8%] bg-[#4ADE80]/40" />
          <div className="absolute inset-y-0 left-[15%] w-[23%] bg-[#F2D038]/40" />
          <div className="absolute inset-y-0 left-[38%] w-[7%] bg-[#F29E38]/40" />
          <div className="absolute inset-y-0 left-[45%] w-[55%] bg-[#F75E5E]/40" />
          <Slider.Range className="absolute h-full bg-accent" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-accent rounded-full shadow-glow focus:outline-none focus:ring-2 focus:ring-accent2/50" />
      </Slider.Root>
      <div className="flex justify-between mt-2 text-[10px] text-faint tabular">
        <span>FN</span>
        <span>MW</span>
        <span>FT</span>
        <span>WW</span>
        <span>BS</span>
      </div>
    </div>
  );
}
