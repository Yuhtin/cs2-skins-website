import { Backpack } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { EQUIPMENT_SLOTS } from '../../lib/weapons';
import { WeaponCard } from './WeaponCard';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';

export function EquipmentSection({ loadout }) {
  const { t } = useTranslation();
  const { selectedWeapon, selectWeapon } = useSelectedWeapon();

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Backpack size={20} className="text-muted" />
        <h2 className="font-display font-bold text-xl uppercase tracking-wide text-muted">
          {t('arsenal.equipment_section')}
        </h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {EQUIPMENT_SLOTS.map((slot) => {
          const applied = loadout[`${slot.internal}.${slot.team}`];
          const pseudoWeapon = {
            internal: slot.internal,
            displayName: t(slot.displayNameKey),
            image: applied?.image || `/weapons/${slot.slotType}_default.png`,
            team: slot.team,
            category: 'equipment',
            slotType: slot.slotType,
          };
          return (
            <WeaponCard
              key={slot.internal}
              weapon={pseudoWeapon}
              appliedSkin={applied}
              isSelected={selectedWeapon?.internal === slot.internal}
              onClick={() => selectWeapon(pseudoWeapon)}
              variant="equipment"
            />
          );
        })}
      </div>
    </section>
  );
}
