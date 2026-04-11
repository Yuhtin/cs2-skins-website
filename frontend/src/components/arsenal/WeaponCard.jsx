import clsx from 'clsx';
import { CustomizedBadge } from './CustomizedBadge';

export function WeaponCard({ weapon, appliedSkin, isSelected, onClick, variant = 'standard', searchHighlight }) {
  const sizeClasses =
    variant === 'equipment'
      ? 'w-[200px] h-[180px]'
      : 'w-[160px] h-[130px]';

  const imageSrc = appliedSkin?.image || weapon.image;
  const customSkinName = appliedSkin?.paint_name ? appliedSkin.paint_name.split('|').slice(1).join('|').trim() : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative group',
        sizeClasses,
        'bg-team-surface border-2 rounded-md p-3 flex flex-col items-center justify-between',
        'transition-all duration-200',
        isSelected
          ? 'border-team-accent shadow-[0_0_0_1px_var(--color-team-accent),0_0_24px_var(--color-team-accent-soft)]'
          : 'border-team-border hover:border-team-accent hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]',
      )}
      aria-pressed={isSelected}
    >
      {appliedSkin && <CustomizedBadge skinName={appliedSkin.paint_name} />}
      <div className="flex-[2] flex items-center justify-center w-full overflow-hidden min-h-0">
        <img
          src={imageSrc}
          alt={weapon.displayName}
          className="max-w-full max-h-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
          draggable={false}
          loading="lazy"
        />
      </div>
      <div className="w-full text-center mt-1.5 flex-shrink-0">
        <div
          className={clsx(
            'font-semibold text-sm truncate leading-tight',
            isSelected ? 'text-team-accent' : 'text-team-fg',
          )}
        >
          {highlightMatch(weapon.displayName, searchHighlight)}
        </div>
        {customSkinName && (
          <div className="text-[10px] text-team-muted truncate mt-0.5">{customSkinName}</div>
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
