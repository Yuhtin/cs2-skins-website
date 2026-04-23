import { useEffect, useState } from 'react';
import { ListChecks } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { ensureAgentCatalog, getAgentByModel, getDefaultAgent } from '../../lib/agents';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';

export function CharacterPreview({ team, loadout, onConfigureLoadout }) {
  const { t } = useTranslation();
  const [catalogReady, setCatalogReady] = useState(false);

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
    appliedAgent?.displayName ||
    appliedAgent?.agent_name ||
    (team === 'CT' ? t('equipment.agent_ct') : t('equipment.agent_t'));

  const TeamCrest = team === 'CT' ? IconCtShield : IconTShield;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative aspect-[3/4] bg-gradient-to-b from-team-surface via-team-bg to-[#000] border-2 border-team-border rounded-xl overflow-hidden flex items-center justify-center shadow-[inset_0_0_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_var(--color-team-accent-soft)]">
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

        <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm border border-team-accent-soft rounded-md p-2">
          <p className="text-[10px] font-semibold text-team-muted uppercase tracking-wider mb-0.5">Agent</p>
          <p className="text-xs font-semibold text-team-fg truncate">{agentName}</p>
        </div>
      </div>

      {onConfigureLoadout && (
        <button
          type="button"
          onClick={onConfigureLoadout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-team-surface border-2 border-team-border hover:border-team-accent rounded-md text-team-fg hover:bg-team-elevated transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.5)] group"
        >
          <ListChecks size={16} className="text-team-accent group-hover:scale-110 transition-transform" />
          <span className="font-display font-bold text-xs uppercase tracking-[0.2em]">
            {t('loadout_prefs.configure_button')}
          </span>
        </button>
      )}
    </div>
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
