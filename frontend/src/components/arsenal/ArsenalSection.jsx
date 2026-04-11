import clsx from 'clsx';
import { Crosshair, Zap, Target, Dumbbell, Backpack } from 'lucide-react';
import { CATEGORIES, groupByCategory } from '../../lib/weapons';
import { useTranslation } from '../../hooks/useTranslation';
import { useTeamHighlight } from '../../hooks/useTeamHighlight';
import { WeaponGrid } from './WeaponGrid';

const ICON_MAP = { Crosshair, Zap, Target, Dumbbell, Backpack };

export function ArsenalSection({ titleKey, icon: TitleIcon, weapons, loadout, search, teamKey }) {
  const { t } = useTranslation();
  const { highlight } = useTeamHighlight();
  const grouped = groupByCategory(weapons);

  const isDimmed = highlight && teamKey && highlight !== teamKey;

  const filter = (list) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((w) => w.displayName.toLowerCase().includes(q));
  };

  const visibleCategories = Object.keys(grouped).filter((cat) => filter(grouped[cat]).length > 0);
  if (visibleCategories.length === 0) return null;

  const accentColor = teamKey === 'CT' ? 'text-accent2' : teamKey === 'T' ? 'text-accent' : 'text-muted';

  return (
    <section
      className={clsx(
        'transition-opacity duration-200',
        isDimmed && 'opacity-40',
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        {TitleIcon && <TitleIcon size={20} className={accentColor} />}
        <h2 className={clsx('font-display font-bold text-xl uppercase tracking-wide', accentColor)}>
          {t(titleKey)}
        </h2>
      </div>
      <div className="space-y-6">
        {visibleCategories.map((catKey) => {
          const cat = CATEGORIES[catKey];
          const CatIcon = ICON_MAP[cat.icon];
          const filtered = filter(grouped[catKey]);
          return (
            <div key={catKey}>
              <div className="flex items-center gap-2 mb-3">
                {CatIcon && <CatIcon size={14} className="text-faint" />}
                <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                  {t(cat.labelKey)}
                </h3>
              </div>
              <WeaponGrid weapons={filtered} loadout={loadout} search={search} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
