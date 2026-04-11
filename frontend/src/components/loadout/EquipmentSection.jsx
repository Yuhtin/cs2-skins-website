import { Swords, Hand, UserSquare2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

// Main-area view when the Equipment tab is active: three large cards (knife,
// gloves, agent) that each open the matching picker dialog via onOpenPicker.
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

export function EquipmentSection({ team, loadout, onOpenPicker }) {
  const { t } = useTranslation();
  const slots = team === 'CT' ? SLOTS_CT : SLOTS_T;

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1">
          <div className="h-[2px] w-4 bg-team-accent" />
          <div className="w-0 h-0 border-l-[6px] border-l-team-accent border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
        </div>
        <h3 className="font-display font-bold text-sm uppercase tracking-[0.25em] text-team-accent whitespace-nowrap">
          {t('arsenal.equipment_section')}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-team-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slots.map((slot) => {
          const applied = loadout[slot.keySuffix];
          const Icon = slot.icon;
          const label = t(slot.labelKey);

          const displayName =
            slot.slotType === 'knife' && applied?.displayName
              ? applied.displayName
              : slot.slotType === 'gloves' && applied?.paint_name
              ? applied.paint_name
              : slot.slotType === 'agent' && applied?.displayName
              ? applied.displayName
              : t('editor.empty_title');

          return (
            <button
              key={slot.slotType}
              type="button"
              onClick={() => onOpenPicker(slot.slotType)}
              className="group relative bg-team-surface border-2 border-team-border rounded-lg p-6 hover:border-team-accent transition-all text-center flex flex-col items-center justify-between gap-4 min-h-[320px] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-2 text-team-accent">
                <Icon size={16} />
                <span className="font-display font-bold text-[11px] uppercase tracking-[0.25em]">
                  {label}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                {applied?.image ? (
                  <img
                    src={applied.image}
                    alt={displayName}
                    className="max-w-full max-h-[180px] object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <Icon size={96} className="text-team-border/50" strokeWidth={1} />
                )}
              </div>

              <div className="w-full">
                <p className="text-sm font-semibold text-team-fg truncate" title={displayName}>
                  {displayName}
                </p>
                <p className="text-[10px] text-team-muted uppercase tracking-wider mt-1">
                  {t('equipment.click_to_change')}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
