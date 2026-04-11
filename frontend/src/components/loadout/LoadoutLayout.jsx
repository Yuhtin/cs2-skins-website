import { useEffect, useRef, useState } from 'react';
import { CategoryRail } from './CategoryRail';
import { WeaponGroup } from './WeaponGroup';
import { CharacterPreview } from './CharacterPreview';
import { useTranslation } from '../../hooks/useTranslation';
import { getWeaponsBySection, WEAPONS } from '../../lib/weapons';

// Single-team loadout view: category rail | weapon groups | character preview
// Wrapping div has data-team attribute to activate team theme tokens.
export function LoadoutLayout({ team, loadout }) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('pistols');
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

  // Filter weapons to the active category (equipment is handled separately in CharacterPreview)
  const currentCategoryWeapons =
    activeCategory === 'equipment'
      ? []
      : teamWeapons.filter((w) => w.category === activeCategory);

  return (
    <div
      data-team={team}
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
          <div className="text-center text-team-muted py-12">
            <p className="text-sm">Equipment shown in the character panel →</p>
          </div>
        ) : (
          <WeaponGroup
            weapons={currentCategoryWeapons}
            categoryId={activeCategory}
            loadout={loadout}
          />
        )}
      </main>
      <aside className="flex-shrink-0 w-[340px] p-6 border-l-2 border-team-border bg-gradient-to-b from-team-surface via-team-bg to-team-bg shadow-[inset_8px_0_24px_rgba(0,0,0,0.4)]">
        <CharacterPreview team={team} loadout={loadout} />
      </aside>
    </div>
  );
}
