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
    <div data-team={team} className="flex bg-team-bg rounded-xl border border-team-border overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <CategoryRail
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        t={t}
      />
      <main ref={scrollContainerRef} className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-120px)] min-h-[600px]">
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
      <aside className="flex-shrink-0 w-[320px] p-6 border-l border-team-border bg-gradient-to-b from-team-surface to-team-bg">
        <CharacterPreview team={team} loadout={loadout} />
      </aside>
    </div>
  );
}
