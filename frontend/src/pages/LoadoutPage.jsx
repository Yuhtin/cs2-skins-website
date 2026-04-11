import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from '../components/layout/Header';
import { Arsenal } from '../components/arsenal/Arsenal';
import { EditorPanel } from '../components/editor/EditorPanel';
import { StickerPicker } from '../components/popups/StickerPicker';
import { KeychainPicker } from '../components/popups/KeychainPicker';
import { useLoadout } from '../hooks/useLoadout';
import { TeamHighlightProvider } from '../hooks/useTeamHighlight';
import { SelectedWeaponProvider } from '../hooks/useSelectedWeapon';
import { TooltipProvider } from '../components/ui/Tooltip';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function LoadoutPage({ user }) {
  const { loadout, refresh } = useLoadout();
  const [search, setSearch] = useState('');
  const [stickerPicker, setStickerPicker] = useState({ open: false, slotIndex: 0, draft: null, updateField: null });
  const [keychainPicker, setKeychainPicker] = useState({ open: false, draft: null, updateField: null });

  useKeyboardShortcuts({
    '/': (e) => {
      e.preventDefault();
      document.querySelector('input[data-search-input="true"]')?.focus();
    },
    'Escape': () => {
      if (window.innerWidth < 1024) {
        window.dispatchEvent(new CustomEvent('skins:close-editor'));
      }
    },
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
      <TeamHighlightProvider>
        <SelectedWeaponProvider>
          <div className="min-h-screen">
            <Header user={user} search={search} onSearchChange={setSearch} />
            <div className="max-w-[1600px] mx-auto px-6 py-6 flex gap-6">
              <main className="flex-1 min-w-0">
                <Arsenal loadout={loadout} search={search} />
              </main>
              <EditorPanel
                loadout={loadout}
                onSaved={refresh}
                onOpenStickerPicker={openStickerPicker}
                onOpenKeychainPicker={openKeychainPicker}
              />
            </div>
          </div>

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
      </TeamHighlightProvider>
    </TooltipProvider>
  );
}
