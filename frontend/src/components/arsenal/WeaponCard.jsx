import clsx from 'clsx';
import { CustomizedBadge } from './CustomizedBadge';

export function WeaponCard({ weapon, appliedSkin, isSelected, onClick, variant = 'standard', searchHighlight }) {
  const sizeClasses =
    variant === 'equipment'
      ? 'w-[200px] h-[180px]'
      : 'w-[140px] h-[110px]';

  const imageSrc = appliedSkin?.image || weapon.image;
  const customSkinName = appliedSkin?.paint_name ? appliedSkin.paint_name.split('|').slice(1).join('|').trim() : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative group',
        sizeClasses,
        'bg-surface border rounded-md p-2 flex flex-col items-center justify-between',
        'transition-all duration-150',
        isSelected
          ? 'border-accent shadow-glow'
          : 'border-subtle hover:border-border hover:-translate-y-0.5 hover:shadow-card',
      )}
      aria-pressed={isSelected}
    >
      {appliedSkin && <CustomizedBadge skinName={appliedSkin.paint_name} />}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={weapon.displayName}
          className="max-w-full max-h-full object-contain drop-shadow-md"
          draggable={false}
          loading="lazy"
        />
      </div>
      <div className="w-full text-center mt-1">
        <div
          className={clsx(
            'font-semibold text-xs truncate',
            isSelected ? 'text-accent' : 'text-fg',
          )}
        >
          {highlightMatch(weapon.displayName, searchHighlight)}
        </div>
        {customSkinName && (
          <div className="text-[10px] text-muted truncate">{customSkinName}</div>
        )}
      </div>
    </button>
  );
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-accent/30 text-accent">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}
