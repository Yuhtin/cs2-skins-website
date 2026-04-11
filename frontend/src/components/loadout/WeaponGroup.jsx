import { WeaponCard } from '../arsenal/WeaponCard';
import { groupBySubgroup } from '../../lib/weapons';
import { useTranslation } from '../../hooks/useTranslation';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';

// Renders all weapons of a given category for the current team,
// broken into subgroups with team-themed headers.
export function WeaponGroup({ weapons, categoryId, loadout }) {
  const { t } = useTranslation();
  const { selectedWeapon, selectWeapon } = useSelectedWeapon();

  const groups = groupBySubgroup(weapons, categoryId);

  if (groups.length === 0) {
    return (
      <div className="text-sm text-team-muted italic px-4 py-8 text-center">
        No weapons in this category
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.subgroupId}>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1">
              <div className="h-[2px] w-4 bg-team-accent" />
              <div className="w-0 h-0 border-l-[6px] border-l-team-accent border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
            </div>
            <h3 className="font-display font-bold text-sm uppercase tracking-[0.25em] text-team-accent whitespace-nowrap">
              {t(group.labelKey)}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-team-border to-transparent" />
          </div>
          <div className="flex flex-wrap gap-4">
            {group.weapons.map((weapon) => {
              const applied = loadout[`${weapon.internal}.${weapon.team === 'both' ? 'CT' : weapon.team}`]
                || loadout[`${weapon.internal}.T`]
                || loadout[`${weapon.internal}.CT`];
              return (
                <WeaponCard
                  key={weapon.internal}
                  weapon={weapon}
                  appliedSkin={applied}
                  isSelected={selectedWeapon?.internal === weapon.internal}
                  onClick={() => selectWeapon(weapon)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
