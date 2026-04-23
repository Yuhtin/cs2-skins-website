import clsx from 'clsx';
import { Target, Zap, Crosshair, Dumbbell, Package, ListChecks } from 'lucide-react';

const RAIL_ITEMS = [
  { id: 'pistols',   icon: Target,     labelKey: 'category.pistols' },
  { id: 'smgs',      icon: Zap,        labelKey: 'category.smgs' },
  { id: 'rifles',    icon: Crosshair,  labelKey: 'category.rifles' },
  { id: 'heavies',   icon: Dumbbell,   labelKey: 'category.heavies' },
  { id: 'equipment', icon: Package,    labelKey: 'category.equipment' },
  { id: 'loadout',   icon: ListChecks, labelKey: 'category.loadout' },
];

export function CategoryRail({ activeCategory, onSelectCategory, t }) {
  return (
    <nav
      aria-label="Category navigation"
      className="flex-shrink-0 w-20 bg-gradient-to-b from-team-surface to-team-bg border-r-2 border-team-border flex flex-col items-center py-6 gap-3"
    >
      {RAIL_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeCategory === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectCategory(item.id)}
            className={clsx(
              'group relative w-14 h-14 flex items-center justify-center rounded-md transition-all duration-150',
              isActive
                ? 'bg-team-accent-soft text-team-accent shadow-[inset_0_0_0_1px_var(--color-team-accent),0_0_20px_var(--color-team-accent-soft)]'
                : 'text-team-muted hover:text-team-fg hover:bg-team-elevated',
            )}
            aria-label={t(item.labelKey)}
            aria-pressed={isActive}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            <span className="absolute left-full ml-3 px-2 py-1 bg-elevated border border-subtle rounded text-[10px] text-fg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export { RAIL_ITEMS };
