import { useRef, useState } from 'react';
import { CategoryRail } from './CategoryRail';
import { WeaponGroup } from './WeaponGroup';
import { CharacterPreview } from './CharacterPreview';
import { EquipmentSection } from './EquipmentSection';
import { LoadoutPrefsSection } from './LoadoutPrefsSection';
import { AgentPickerDialog } from '../popups/AgentPickerDialog';
import { KnifePickerDialog } from '../popups/KnifePickerDialog';
import { GlovesPickerDialog } from '../popups/GlovesPickerDialog';
import { LoadoutPrefsPickerDialog } from '../popups/LoadoutPrefsPickerDialog';
import { useTranslation } from '../../hooks/useTranslation';
import { useSelectedWeapon } from '../../hooks/useSelectedWeapon';
import { useLoadoutPrefs } from '../../hooks/useLoadoutPrefs';
import { WEAPONS } from '../../lib/weapons';

// Single-team loadout view: category rail | weapon groups | character preview
// Wrapping div has data-team attribute to activate team theme tokens.
export function LoadoutLayout({ team, loadout, onRefreshLoadout }) {
  const { t } = useTranslation();
  const { selectWeapon } = useSelectedWeapon();
  const { prefs, setPref } = useLoadoutPrefs();
  const [activeCategory, setActiveCategory] = useState('pistols');
  // activePicker lives here so the compact side rail AND the EquipmentSection
  // main-area view can share the same dialog set.
  const [activePicker, setActivePicker] = useState(null); // 'knife' | 'gloves' | 'agent' | null
  // Loadout-prefs picker is keyed by slot name (PistolRound, FullBuyPrimary, ...).
  const [activePrefSlot, setActivePrefSlot] = useState(null);
  const scrollContainerRef = useRef(null);

  // Combine team-specific + shared weapons into the current team's view.
  const teamWeapons = WEAPONS.filter(
    (w) => w.team === team || w.team === 'both'
  );

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    // Scroll to top on category change — the grid shows only that category now.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Filter weapons to the active category (equipment is handled separately)
  const currentCategoryWeapons =
    activeCategory === 'equipment'
      ? []
      : teamWeapons.filter((w) => w.category === activeCategory);

  const appliedKnife = loadout[team === 'CT' ? 'knife_ct.CT' : 'knife_t.T'];
  const knifePaints = loadout[team === 'CT' ? 'knife_paints.CT' : 'knife_paints.T'] || {};

  // Opens the main EditorDrawer for editing a knife's paint. Accepts either
  // the currently-applied knife (from EquipmentRail/EditPaint button) or a
  // freshly-picked knife (from KnifePickerDialog's onPickThenEdit).
  const openKnifePaintEditor = (knifeMeta) => {
    if (!knifeMeta?.defindex) return;
    setActivePicker(null);
    selectWeapon({
      internal: team === 'CT' ? 'knife_ct' : 'knife_t',
      displayName: knifeMeta.displayName,
      image: knifeMeta.image || `/weapons/weapon_${knifeMeta.internal}.png`,
      team,
      category: 'equipment',
      slotType: 'knife_paint',        // distinct from 'knife' so EditorPanel calls saveSkin
      cs2Id: knifeMeta.defindex,       // required for SkinPicker to filter paints
    });
  };

  return (
    <div
      key={team}
      data-team={team}
      style={{ animation: 'team-fade-in 300ms ease-out' }}
      className="relative flex bg-team-bg rounded-xl border-2 border-team-border overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)] min-h-[640px]"
    >
      {/* Team-accent glow stripe at the top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-team-accent to-transparent opacity-60 pointer-events-none" />
      {/* Corner accent brackets */}
      <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-team-accent" />
        <div className="absolute top-0 left-0 h-full w-[2px] bg-team-accent" />
      </div>
      <div className="absolute top-3 right-3 w-6 h-6 pointer-events-none z-10">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-team-accent" />
        <div className="absolute top-0 right-0 h-full w-[2px] bg-team-accent" />
      </div>
      <div className="absolute bottom-3 left-3 w-6 h-6 pointer-events-none z-10">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-team-accent" />
        <div className="absolute bottom-0 left-0 h-full w-[2px] bg-team-accent" />
      </div>
      <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none z-10">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-team-accent" />
        <div className="absolute bottom-0 right-0 h-full w-[2px] bg-team-accent" />
      </div>
      <CategoryRail
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        t={t}
      />
      <main ref={scrollContainerRef} className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-140px)] min-h-[600px]">
        {activeCategory === 'equipment' ? (
          <EquipmentSection
            team={team}
            loadout={loadout}
            onOpenPicker={setActivePicker}
          />
        ) : activeCategory === 'loadout' ? (
          <LoadoutPrefsSection
            team={team}
            loadout={loadout}
            prefs={prefs}
            onOpenPicker={setActivePrefSlot}
          />
        ) : (
          <WeaponGroup
            weapons={currentCategoryWeapons}
            categoryId={activeCategory}
            loadout={loadout}
            team={team}
          />
        )}
      </main>
      <aside className="flex-shrink-0 w-[340px] p-6 border-l-2 border-team-border bg-gradient-to-b from-team-surface via-team-bg to-team-bg shadow-[inset_8px_0_24px_rgba(0,0,0,0.4)]">
        <CharacterPreview
          team={team}
          loadout={loadout}
          onConfigureLoadout={() => setActiveCategory('loadout')}
        />
      </aside>

      <AgentPickerDialog
        open={activePicker === 'agent'}
        team={team}
        onClose={() => setActivePicker(null)}
        onSaved={onRefreshLoadout}
      />
      <KnifePickerDialog
        open={activePicker === 'knife'}
        team={team}
        appliedKnife={appliedKnife}
        knifePaints={knifePaints}
        onClose={() => setActivePicker(null)}
        onSaved={onRefreshLoadout}
        onEditPaint={() => openKnifePaintEditor(appliedKnife)}
        onPickThenEdit={(knifeFromPicker) => openKnifePaintEditor(knifeFromPicker)}
      />
      <GlovesPickerDialog
        open={activePicker === 'gloves'}
        team={team}
        onClose={() => setActivePicker(null)}
        onSaved={onRefreshLoadout}
      />
      <LoadoutPrefsPickerDialog
        open={activePrefSlot !== null}
        team={team}
        slot={activePrefSlot}
        loadout={loadout}
        currentCsItem={activePrefSlot ? prefs?.[team]?.[activePrefSlot] : null}
        onPick={(csItem) => setPref(team, activePrefSlot, csItem)}
        onClear={() => setPref(team, activePrefSlot, null)}
        onClose={() => setActivePrefSlot(null)}
      />
    </div>
  );
}
