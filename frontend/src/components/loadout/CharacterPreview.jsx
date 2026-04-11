import { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { EquipmentRail } from './EquipmentRail';
import { useTranslation } from '../../hooks/useTranslation';
import { ensureAgentCatalog, getAgentByModel, getDefaultAgent } from '../../lib/agents';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';
import { CharacterZoomModal } from './CharacterZoomModal';

export function CharacterPreview({ team, loadout, onRefreshLoadout }) {
  const { t } = useTranslation();
  const [catalogReady, setCatalogReady] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Ensure the agents catalog is loaded before we try to resolve applied agents.
  useEffect(() => {
    ensureAgentCatalog().then(() => setCatalogReady(true));
  }, []);

  const agentKey = team === 'CT' ? 'ct_agent.CT' : 'tt_agent.T';
  const appliedAgent = loadout[agentKey];

  // Try to resolve the applied agent's model to a catalog image.
  const lookedUp = catalogReady && appliedAgent?.agent
    ? getAgentByModel(appliedAgent.agent)
    : null;

  const defaultAgent = getDefaultAgent(team);
  const imageSrc = lookedUp?.image || appliedAgent?.image || defaultAgent.image;
  const agentName =
    lookedUp?.name ||
    appliedAgent?.agent_name ||
    (team === 'CT' ? t('equipment.agent_ct') : t('equipment.agent_t'));

  const TeamCrest = team === 'CT' ? IconCtShield : IconTShield;

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="relative flex-1 bg-gradient-to-b from-team-surface via-team-bg to-[#000] border-2 border-team-border rounded-xl overflow-hidden flex items-center justify-center min-h-[400px] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_var(--color-team-accent-soft)]">
          {/* Corner decorative brackets */}
          <CornerBracket className="top-2 left-2" />
          <CornerBracket className="top-2 right-2" rotate={90} />
          <CornerBracket className="bottom-2 right-2" rotate={180} />
          <CornerBracket className="bottom-2 left-2" rotate={270} />

          {/* Team crest watermark top-center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-team-accent opacity-80">
            <TeamCrest size={14} />
            <span className="font-display font-bold text-[10px] uppercase tracking-[0.3em]">
              {team === 'CT' ? 'Counter-Terrorist' : 'Terrorist'}
            </span>
          </div>

          {/* Subtle radial highlight behind character */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--color-team-accent-soft),transparent_55%)] pointer-events-none" />

          <img
            src={imageSrc}
            alt={agentName}
            className="relative max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.8)]"
            draggable={false}
          />

          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-md bg-black/50 backdrop-blur-sm border border-team-accent-soft text-team-accent hover:bg-black/70 transition-colors z-10"
            aria-label="Zoom"
          >
            <Maximize2 size={14} />
          </button>

          <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm border border-team-accent-soft rounded-md p-2">
            <p className="text-[10px] font-semibold text-team-muted uppercase tracking-wider mb-0.5">Agent</p>
            <p className="text-xs font-semibold text-team-fg truncate">{agentName}</p>
          </div>
        </div>
        <EquipmentRail team={team} loadout={loadout} onRefreshLoadout={onRefreshLoadout} />
      </div>
      <CharacterZoomModal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        team={team}
        imageSrc={imageSrc}
        agentName={agentName}
      />
    </>
  );
}

// Decorative L-shaped corner bracket (military targeting reticle style).
function CornerBracket({ className, rotate = 0 }) {
  return (
    <div
      className={`absolute w-5 h-5 ${className} pointer-events-none`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-team-accent opacity-50" />
      <div className="absolute top-0 left-0 h-full w-[2px] bg-team-accent opacity-50" />
    </div>
  );
}
