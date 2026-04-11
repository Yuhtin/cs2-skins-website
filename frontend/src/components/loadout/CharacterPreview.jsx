import { EquipmentRail } from './EquipmentRail';
import { useTranslation } from '../../hooks/useTranslation';

export function CharacterPreview({ team, loadout }) {
  const { t } = useTranslation();

  const agentKey = team === 'CT' ? 'ct_agent.CT' : 'tt_agent.T';
  const appliedAgent = loadout[agentKey];

  // Agent image: prefer the applied skin image, else the team-generic default
  // silhouette shipped in frontend/public/agents/ (SAS for CT, Phoenix for T).
  const defaultAgentImage = team === 'CT' ? '/agents/ct_sas.png' : '/agents/tt_phoenix.png';
  const imageSrc = appliedAgent?.image || defaultAgentImage;
  const agentName = appliedAgent?.agent_name || (team === 'CT' ? t('equipment.agent_ct') : t('equipment.agent_t'));

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative flex-1 bg-gradient-to-b from-team-surface via-team-bg to-[#000] border-2 border-team-border rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_var(--color-team-accent-soft)]">
        {/* Subtle radial highlight behind character */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--color-team-accent-soft),transparent_60%)] pointer-events-none" />
        <img
          src={imageSrc}
          alt={agentName}
          className="relative max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
          draggable={false}
        />
        <div className="absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-sm border border-team-border rounded-md p-2">
          <p className="text-xs font-semibold text-team-fg truncate">{agentName}</p>
        </div>
      </div>
      <EquipmentRail team={team} loadout={loadout} />
    </div>
  );
}
