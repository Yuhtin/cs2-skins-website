import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from '../components/layout/Header';
import { LoadoutLayout } from '../components/loadout/LoadoutLayout';
import { TeamToggle } from '../components/loadout/TeamToggle';
import { EditorDrawer } from '../components/loadout/EditorDrawer';
import { StickerPicker } from '../components/popups/StickerPicker';
import { KeychainPicker } from '../components/popups/KeychainPicker';
import { useLoadout } from '../hooks/useLoadout';
import { SelectedWeaponProvider } from '../hooks/useSelectedWeapon';
import { TooltipProvider } from '../components/ui/Tooltip';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function LoadoutPage({ user }) {
  const { loadout, refresh } = useLoadout();
  const [currentTeam, setCurrentTeam] = useState('CT'); // 'CT' | 'T'
  const [stickerPicker, setStickerPicker] = useState({ open: false, slotIndex: 0, draft: null, updateField: null });
  const [keychainPicker, setKeychainPicker] = useState({ open: false, draft: null, updateField: null });

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

  const openStickerPicker = (slotIndex, draft, updateField) => {
    setStickerPicker({ open: true, slotIndex, draft, updateField });
  };
  const openKeychainPicker = (draft, updateField) => {
    setKeychainPicker({ open: true, draft, updateField });
  };

  return (
    <TooltipProvider>
      <SelectedWeaponProvider>
        <div className="min-h-screen">
          <Header user={user} />
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display font-bold text-2xl uppercase tracking-wider text-fg">
                Loadout
              </h1>
              <TeamToggle team={currentTeam} onChange={setCurrentTeam} />
            </div>
            <LoadoutLayout team={currentTeam} loadout={loadout} />
          </div>
        </div>

        <EditorDrawer
          loadout={loadout}
          onSaved={refresh}
          onOpenStickerPicker={openStickerPicker}
          onOpenKeychainPicker={openKeychainPicker}
        />

        <StickerPicker
          open={stickerPicker.open}
          slotIndex={stickerPicker.slotIndex}
          onClose={() => setStickerPicker({ open: false, slotIndex: 0, draft: null, updateField: null })}
          onPick={(sticker) => {
            if (!stickerPicker.updateField) return;
            const stickers = [...stickerPicker.draft.stickers];
            stickers[stickerPicker.slotIndex] = `${sticker.id};0;0;0;0;0;0`;
            stickerPicker.updateField('stickers', stickers);
          }}
        />

        <KeychainPicker
          open={keychainPicker.open}
          onClose={() => setKeychainPicker({ open: false, draft: null, updateField: null })}
          onPick={({ id, offsetX, offsetY }) => {
            if (!keychainPicker.updateField) return;
            keychainPicker.updateField('keychain', `${id};${offsetX};${offsetY};0;0`);
          }}
        />

        <Toaster theme="dark" position="bottom-right" />
      </SelectedWeaponProvider>
    </TooltipProvider>
  );
}
