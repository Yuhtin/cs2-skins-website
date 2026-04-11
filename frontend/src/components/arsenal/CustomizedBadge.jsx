import { Tooltip } from '../ui/Tooltip';

export function CustomizedBadge({ skinName }) {
  return (
    <Tooltip content={skinName || 'Customized'}>
      <div
        className="absolute top-2 left-2 w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_rgba(242,158,56,0.8)]"
        aria-label="Customized"
      />
    </Tooltip>
  );
}
