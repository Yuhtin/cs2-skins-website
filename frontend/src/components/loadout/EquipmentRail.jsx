import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { AgentPickerDialog } from '../popups/AgentPickerDialog';
import { KnifePickerDialog } from '../popups/KnifePickerDialog';
import { GlovesPickerDialog } from '../popups/GlovesPickerDialog';

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

export function EquipmentRail({ team, loadout, onRefreshLoadout }) {
  const { t } = useTranslation();
  const [activePicker, setActivePicker] = useState(null); // 'knife' | 'gloves' | 'agent' | null

  const slots = team === 'CT' ? SLOTS_CT : SLOTS_T;

  return (
    <>
      <div className="flex gap-2">
        {slots.map((slot) => {
          const applied = loadout[`${slot.internal}.${slot.team}`];
          const imageSrc = applied?.image || `/weapons/${slot.slotType}_default.png`;
          return (
            <button
              key={slot.internal}
              type="button"
              onClick={() => setActivePicker(slot.slotType)}
              className="flex-1 aspect-square bg-team-bg border-2 border-team-border rounded-md p-2 flex flex-col items-center justify-center gap-1 hover:border-team-accent transition-colors"
            >
              <img
                src={imageSrc}
                alt={t(slot.labelKey)}
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

      <AgentPickerDialog
        open={activePicker === 'agent'}
        team={team}
        onClose={() => setActivePicker(null)}
        onSaved={onRefreshLoadout}
      />
      <KnifePickerDialog
        open={activePicker === 'knife'}
        team={team}
        onClose={() => setActivePicker(null)}
        onSaved={onRefreshLoadout}
      />
      <GlovesPickerDialog
        open={activePicker === 'gloves'}
        team={team}
        onClose={() => setActivePicker(null)}
        onSaved={onRefreshLoadout}
      />
    </>
  );
}
