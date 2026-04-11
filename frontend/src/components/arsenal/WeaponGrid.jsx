import { WeaponCard } from './WeaponCard';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';

export function WeaponGrid({ weapons, loadout, search }) {
  const { selectedWeapon, selectWeapon } = useSelectedWeapon();

  return (
    <div className="flex flex-wrap gap-3">
      {weapons.map((weapon) => {
        const key = `${weapon.internal}.${weapon.team === 'both' ? 'CT' : weapon.team}`;
        const applied = loadout[key] || loadout[`${weapon.internal}.T`] || loadout[`${weapon.internal}.CT`];
        return (
          <WeaponCard
            key={weapon.internal}
            weapon={weapon}
            appliedSkin={applied}
            isSelected={selectedWeapon?.internal === weapon.internal}
            onClick={() => selectWeapon(weapon)}
            searchHighlight={search}
          />
        );
      })}
    </div>
  );
}
