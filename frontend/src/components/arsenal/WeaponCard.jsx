import clsx from 'clsx';
import { CustomizedBadge } from './CustomizedBadge';

export function WeaponCard({ weapon, appliedSkin, isSelected, onClick, variant = 'standard', searchHighlight }) {
  const sizeClasses =
    variant === 'equipment'
      ? 'w-[200px] h-[180px]'
      : 'w-[160px] h-[130px]';

  const imageSrc = appliedSkin?.image || weapon.image;
  const customSkinName = appliedSkin?.paint_name
    ? appliedSkin.paint_name.split('|').slice(1).join('|').trim()
    : null;

  const rarityColor = appliedSkin?.rarity_color;
  const wearValue = appliedSkin?.weapon_wear;
  const hasWear = wearValue != null && Number(wearValue) > 0;

  const stickerCount = appliedSkin
    ? [
        appliedSkin.weapon_sticker_0,
        appliedSkin.weapon_sticker_1,
        appliedSkin.weapon_sticker_2,
        appliedSkin.weapon_sticker_3,
      ].filter((s) => s && String(s).split(';')[0] !== '0').length
    : 0;

  // If a rarity color is present we override the border via inline style.
  const borderStyle = !isSelected && rarityColor
    ? { borderColor: rarityColor, boxShadow: `0 0 12px ${rarityColor}20` }
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      style={borderStyle}
      className={clsx(
        'relative group',
        sizeClasses,
        'bg-team-surface border-2 rounded-md p-3 flex flex-col items-center justify-between',
        'transition-all duration-200',
        isSelected
          ? 'border-team-accent shadow-[0_0_0_1px_var(--color-team-accent),0_0_24px_var(--color-team-accent-soft)]'
          : rarityColor
          ? 'hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)]'
          : 'border-team-border hover:border-team-accent hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]',
      )}
      aria-pressed={isSelected}
    >
      {appliedSkin && <CustomizedBadge skinName={appliedSkin.paint_name} />}

      {/* Sticker count badge (top-right) */}
      {stickerCount > 0 && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-team-accent text-team-bg font-bold text-[10px] flex items-center justify-center shadow-[0_0_6px_var(--color-team-accent-soft)]"
          aria-label={`${stickerCount} sticker${stickerCount > 1 ? 's' : ''}`}
        >
          {stickerCount}
        </div>
      )}

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
        {/* Wear bar — 5 segments representing FN/MW/FT/WW/BS */}
        {hasWear && <WearBar wear={Number(wearValue)} />}
      </div>
    </button>
  );
}

// Mini wear indicator. 5 segments with gaps matching the wear tier boundaries.
// The "active" segment is highlighted; others are dimmed.
function WearBar({ wear }) {
  const segments = [
    { color: '#5BA3FF', threshold: 0.07 },  // FN
    { color: '#4ADE80', threshold: 0.15 },  // MW
    { color: '#F2D038', threshold: 0.38 },  // FT
    { color: '#F29E38', threshold: 0.45 },  // WW
    { color: '#F75E5E', threshold: 1.01 },  // BS
  ];
  const activeIndex = segments.findIndex((seg) => wear < seg.threshold);

  return (
    <div className="flex gap-[2px] mt-1 h-[3px] w-full" aria-label={`Wear: ${wear.toFixed(2)}`}>
      {segments.map((seg, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            backgroundColor: i === activeIndex ? seg.color : `${seg.color}33`,
          }}
        />
      ))}
    </div>
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
