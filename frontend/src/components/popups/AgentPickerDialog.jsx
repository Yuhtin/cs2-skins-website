import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../../hooks/useTranslation';
import { ensureAgentCatalog } from '../../lib/agents';
import { saveAgent } from '../../lib/api';

export function AgentPickerDialog({ open, team, onClose, onSaved }) {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // team is 'CT' or 'T'; catalog stores team as 3 (CT) or 2 (T).
  const teamNum = team === 'CT' ? 3 : 2;

  useEffect(() => {
    if (open) ensureAgentCatalog().then((data) => setCatalog(data));
  }, [open]);

  const filtered = useMemo(() => {
    return catalog.filter((a) => a.team === teamNum);
  }, [catalog, teamNum]);

  const handlePick = async (agent) => {
    setIsSaving(true);
    try {
      await saveAgent({
        team,                                   // 'CT' or 'T' for backend's team validation block
        agent_model: agent.model,               // the character model string
        agent_team: team === 'CT' ? 3 : 2,      // numeric for the backend agent_save branch
      });
      toast.success(t('toast.save_success'));
      onSaved();
      onClose();
    } catch (err) {
      toast.error(t('toast.save_error', { error: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl h-[85vh] bg-elevated border border-subtle rounded-xl shadow-elevated z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-subtle">
            <Dialog.Title className="font-display font-bold text-xl">
              {team === 'CT' ? t('equipment.agent_ct') : t('equipment.agent_t')}
            </Dialog.Title>
            <Dialog.Close className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-surface">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((agent) => (
                <button
                  key={`${agent.model}-${agent.agent_name}`}
                  type="button"
                  onClick={() => handlePick(agent)}
                  disabled={isSaving}
                  className="group relative bg-bg border-2 border-subtle rounded-md p-3 hover:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title={agent.agent_name}
                >
                  <div className="aspect-[3/4] flex items-center justify-center mb-2">
                    <img
                      src={agent.image}
                      alt={agent.agent_name}
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[10px] text-muted truncate text-center">{agent.agent_name}</p>
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-faint py-12">No agents found</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
