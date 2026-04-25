import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from '../components/layout/Header';
import { LoadoutLayout } from '../components/loadout/LoadoutLayout';
import { TeamToggle } from '../components/loadout/TeamToggle';
import { EditorDrawer } from '../components/loadout/EditorDrawer';
import { useLoadout } from '../hooks/useLoadout';
import { SelectedWeaponProvider } from '../hooks/useSelectedWeapon';
import { TooltipProvider } from '../components/ui/Tooltip';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useTranslation } from '../hooks/useTranslation';

export function LoadoutPage({ user }) {
  const { t } = useTranslation();
  const { loadout, refresh } = useLoadout();
  const [currentTeam, setCurrentTeam] = useState('CT'); // 'CT' | 'T'

  useKeyboardShortcuts({
    'Mod+s': (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('skins:save-editor'));
    },
    'Mod+z': (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('skins:revert-editor'));
    },
  });

  return (
    <TooltipProvider>
      <SelectedWeaponProvider>
        <div className="min-h-screen">
          <Header user={user} />
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display font-black text-4xl uppercase tracking-[0.1em] text-fg leading-none">
                  Loadout
                </h1>
                <p className="text-xs text-faint uppercase tracking-[0.3em] mt-1">{t('loadout.subtitle')}</p>
              </div>
              <TeamToggle team={currentTeam} onChange={setCurrentTeam} />
            </div>
            <LoadoutLayout team={currentTeam} loadout={loadout} onRefreshLoadout={refresh} />
          </div>
        </div>

        <EditorDrawer
          loadout={loadout}
          onSaved={refresh}
        />

        <Toaster theme="dark" position="bottom-right" />
      </SelectedWeaponProvider>
    </TooltipProvider>
  );
}
