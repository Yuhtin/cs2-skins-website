import { useTranslation } from '../../hooks/useTranslation';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';

const SLOTS_CT = [
  { internal: 'knife_ct',  slotType: 'knife',  team: 'CT', labelKey: 'equipment.knife_ct' },
  { internal: 'ct_gloves', slotType: 'gloves', team: 'CT', labelKey: 'equipment.gloves_ct' },
  { internal: 'ct_agent',  slotType: 'agent',  team: 'CT', labelKey: 'equipment.agent_ct' },
];
const SLOTS_T = [
  { internal: 'knife_t',   slotType: 'knife',  team: 'T', labelKey: 'equipment.knife_t' },
  { internal: 'tt_gloves', slotType: 'gloves', team: 'T', labelKey: 'equipment.gloves_t' },
  { internal: 'tt_agent',  slotType: 'agent',  team: 'T', labelKey: 'equipment.agent_t' },
];

export function EquipmentRail({ team, loadout }) {
  const { t } = useTranslation();
  const { selectedWeapon, selectWeapon } = useSelectedWeapon();

  const slots = team === 'CT' ? SLOTS_CT : SLOTS_T;

  return (
    <div className="flex gap-2">
      {slots.map((slot) => {
        const applied = loadout[`${slot.internal}.${slot.team}`];
        const isSelected = selectedWeapon?.internal === slot.internal;
        const pseudoWeapon = {
          internal: slot.internal,
          displayName: t(slot.labelKey),
          image: applied?.image || `/weapons/${slot.slotType}_default.png`,
          team: slot.team,
          category: 'equipment',
          slotType: slot.slotType,
        };
        return (
          <button
            key={slot.internal}
            type="button"
            onClick={() => selectWeapon(pseudoWeapon)}
            className={
              isSelected
                ? 'flex-1 aspect-square bg-team-bg border-2 border-team-accent rounded-md p-2 flex flex-col items-center justify-center gap-1'
                : 'flex-1 aspect-square bg-team-bg border border-team-border rounded-md p-2 flex flex-col items-center justify-center gap-1 hover:border-team-accent transition-colors'
            }
          >
            <img
              src={pseudoWeapon.image}
              alt={pseudoWeapon.displayName}
              className="max-w-full max-h-[60%] object-contain"
              draggable={false}
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-team-muted truncate w-full text-center">
              {t(slot.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
