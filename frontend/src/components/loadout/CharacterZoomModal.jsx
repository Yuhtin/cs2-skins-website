import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';

export function CharacterZoomModal({ open, onClose, team, imageSrc, agentName }) {
  const { t } = useTranslation();
  const TeamCrest = team === 'CT' ? IconCtShield : IconTShield;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/95 backdrop-blur-md z-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-8">
          <Dialog.Close className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-md bg-surface border border-subtle text-muted hover:text-fg hover:bg-elevated transition-colors">
            <X size={20} />
          </Dialog.Close>

          <div className="absolute top-6 left-6 flex items-center gap-2 text-team-accent">
            <TeamCrest size={20} />
            <span className="font-display font-bold text-sm uppercase tracking-[0.25em]">
              {team === 'CT' ? 'Counter-Terrorist' : 'Terrorist'}
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-6 max-w-4xl max-h-full">
            <img
              src={imageSrc}
              alt={agentName}
              className="max-w-full max-h-[80vh] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
              draggable={false}
            />
            <div className="text-center">
              <p className="text-[10px] text-muted uppercase tracking-[0.3em] mb-1">Agent</p>
              <Dialog.Title className="font-display font-bold text-2xl text-fg">{agentName}</Dialog.Title>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
