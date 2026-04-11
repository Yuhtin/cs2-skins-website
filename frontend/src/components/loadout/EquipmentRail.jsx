import { Swords, Hand, UserSquare2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

// Compact 3-slot current-state rail shown beneath the character preview.
// Clicking any slot calls onOpenPicker(slotType) — the parent routes to the
// Equipment tab and opens the matching dialog.
const SLOTS_CT = [
  { slotType: 'knife',  labelKey: 'equipment.knife_ct',  keySuffix: 'knife_ct.CT',  icon: Swords },
  { slotType: 'gloves', labelKey: 'equipment.gloves_ct', keySuffix: 'ct_gloves.CT', icon: Hand },
  { slotType: 'agent',  labelKey: 'equipment.agent_ct',  keySuffix: 'ct_agent.CT',  icon: UserSquare2 },
];
const SLOTS_T = [
  { slotType: 'knife',  labelKey: 'equipment.knife_t',  keySuffix: 'knife_t.T',    icon: Swords },
  { slotType: 'gloves', labelKey: 'equipment.gloves_t', keySuffix: 'tt_gloves.T',  icon: Hand },
  { slotType: 'agent',  labelKey: 'equipment.agent_t',  keySuffix: 'tt_agent.T',   icon: UserSquare2 },
];

export function EquipmentRail({ team, loadout, onOpenPicker }) {
  const { t } = useTranslation();
  const slots = team === 'CT' ? SLOTS_CT : SLOTS_T;

  return (
    <div className="flex gap-2">
      {slots.map((slot) => {
        const applied = loadout[slot.keySuffix];
        const Icon = slot.icon;

        const label =
          slot.slotType === 'knife' && applied?.displayName
            ? applied.displayName
            : slot.slotType === 'gloves' && applied?.paint_name
            ? applied.paint_name.split('|').slice(1).join('|').trim() || t(slot.labelKey)
            : slot.slotType === 'agent' && applied?.displayName
            ? applied.displayName.split('|')[0].trim()
            : t(slot.labelKey);

        return (
          <button
            key={slot.slotType}
            type="button"
            onClick={() => onOpenPicker(slot.slotType)}
            className="flex-1 aspect-square bg-team-bg border-2 border-team-border rounded-md p-2 flex flex-col items-center justify-center gap-1 hover:border-team-accent transition-colors"
          >
            {applied?.image ? (
              <img
                src={applied.image}
                alt={label}
                className="max-w-full max-h-[60%] object-contain"
                draggable={false}
              />
            ) : (
              <Icon size={28} className="text-team-border/60" strokeWidth={1.5} />
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-team-muted truncate w-full text-center">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
