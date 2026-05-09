import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';
import { useTranslation } from '../../hooks/useTranslation';
import { saveSkin } from '../../lib/api';
import { EditorEmptyState } from './EditorEmptyState';
import { EditorHeader } from './EditorHeader';
import { SkinPreview } from './SkinPreview';
import { SkinPicker } from './SkinPicker';
import { WearSlider } from './WearSlider';
import { SeedInput } from './SeedInput';
import { NametagInput } from './NametagInput';
import { StatTrakSwitch } from './StatTrakSwitch';
import { EditorFooter } from './EditorFooter';

export function EditorPanel({ loadout, onSaved, mobile = false }) {
  const { t } = useTranslation();
  const { selectedWeapon, isDirty, clearDirty, markDirty, selectWeapon } = useSelectedWeapon();
  const [draft, setDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Ref for keyboard shortcut handlers — bound once, updated per-render.
  // Must be declared unconditionally before any early return.
  const handlersRef = useRef({});

  useEffect(() => {
    if (!selectedWeapon) {
      setDraft(null);
      return;
    }
    setDraft(buildDraftFromLoadout(selectedWeapon, loadout));
    clearDirty();
  }, [selectedWeapon, loadout, clearDirty]);

  useEffect(() => {
    function onSave() {
      if (handlersRef.current.isDirty) handlersRef.current.handleSave?.();
    }
    function onRevert() {
      if (handlersRef.current.isDirty) handlersRef.current.handleRevert?.();
    }
    window.addEventListener('skins:save-editor', onSave);
    window.addEventListener('skins:revert-editor', onRevert);
    return () => {
      window.removeEventListener('skins:save-editor', onSave);
      window.removeEventListener('skins:revert-editor', onRevert);
    };
  }, []);

  const wrapperClass = mobile
    ? 'h-full flex flex-col'
    : 'sticky top-[60px] h-[calc(100vh-60px)] w-[420px] bg-elevated border-l border-subtle overflow-hidden hidden lg:flex flex-col';

  if (!selectedWeapon || !draft) {
    return (
      <aside className={wrapperClass}>
        <EditorEmptyState />
      </aside>
    );
  }

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    markDirty(field, value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const params = buildSaveParams(selectedWeapon, draft);
      await saveSkin(params);
      toast.success(t('toast.save_success'));
      clearDirty();
      onSaved();
      selectWeapon(null); // auto-close the drawer
    } catch (err) {
      toast.error(t('toast.save_error', { error: err.message }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    setDraft(buildDraftFromLoadout(selectedWeapon, loadout));
    clearDirty();
  };

  // Update the ref AFTER handlers are defined, on every render. This runs
  // unconditionally in the rendered path (we passed the early return, so
  // the handlers always exist by now).
  handlersRef.current.handleSave = handleSave;
  handlersRef.current.handleRevert = handleRevert;
  handlersRef.current.isDirty = isDirty;

  return (
    <aside className={wrapperClass}>
      <div className="flex-1 overflow-y-auto">
        <EditorHeader weapon={selectedWeapon} isDirty={isDirty} onRevert={handleRevert} />
        <SkinPreview weapon={selectedWeapon} skin={draft.skin} wear={draft.wear} />
        <SkinPicker
          weaponDefindex={selectedWeapon.cs2Id}
          selectedPaintId={draft.paintId}
          onSelect={(skin) => {
            updateField('paintId', skin.paint);
            updateField('skin', skin);
          }}
        />
        <WearSlider value={draft.wear} onChange={(v) => updateField('wear', v)} />
        <SeedInput value={draft.seed} onChange={(v) => updateField('seed', v)} />
        <NametagInput value={draft.nametag} onChange={(v) => updateField('nametag', v)} />
        <StatTrakSwitch value={draft.stattrak} onChange={(v) => updateField('stattrak', v)} />
      </div>
      <EditorFooter isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onRevert={handleRevert} />
    </aside>
  );
}

function buildDraftFromLoadout(selectedWeapon, loadout) {
  // selectedWeapon.team is always 'CT' or 'T' — WeaponGroup pins shared weapons
  // (definition team='both') to whichever tab the user clicked from.
  const key = `${selectedWeapon.internal}.${selectedWeapon.team}`;
  const applied = loadout[key];
  return {
    paintId: applied?.weapon_paint_id ?? 0,
    wear: applied?.weapon_wear ?? 0.0001,
    seed: applied?.weapon_seed ?? 0,
    nametag: applied?.weapon_nametag ?? '',
    stattrak: !!applied?.weapon_stattrak,
    stickers: [
      applied?.weapon_sticker_0 || '0;0;0;0;0;0;0',
      applied?.weapon_sticker_1 || '0;0;0;0;0;0;0',
      applied?.weapon_sticker_2 || '0;0;0;0;0;0;0',
      applied?.weapon_sticker_3 || '0;0;0;0;0;0;0',
    ],
    keychain: applied?.weapon_keychain || '0;0;0;0;0',
    skin: applied,
  };
}

function buildSaveParams(weapon, draft) {
  // weapon.team is always 'CT' or 'T' — WeaponGroup overrides shared weapons
  // ('both') with the current tab so each side gets its own wp_player_skins row.
  const team = weapon.team;
  return {
    team,
    weapon_defindex: weapon.cs2Id,
    paint: draft.paintId,
    wear: draft.wear,
    seed: draft.seed,
    nametag: draft.nametag,
    stattrak: draft.stattrak ? 1 : 0,
    sticker_0: draft.stickers[0],
    sticker_1: draft.stickers[1],
    sticker_2: draft.stickers[2],
    sticker_3: draft.stickers[3],
    keychain: draft.keychain,
  };
}
