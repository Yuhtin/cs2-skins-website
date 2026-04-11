import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../ui/Input';

// Loads the skins_en.json catalog once, then filters by weapon_defindex + search.
let CATALOG_CACHE = null;
async function loadCatalog() {
  if (CATALOG_CACHE) return CATALOG_CACHE;
  const res = await fetch('/data/skins_en.json');
  CATALOG_CACHE = await res.json();
  return CATALOG_CACHE;
}

export function SkinPicker({ weaponDefindex, selectedPaintId, onSelect }) {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');
  const [hoveredSkin, setHoveredSkin] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadCatalog().then(setCatalog);
  }, []);

  const skins = useMemo(() => {
    const filtered = catalog.filter((s) => s.weapon_defindex === weaponDefindex);
    if (!search) return filtered;
    const q = search.toLowerCase();
    return filtered.filter((s) => (s.paint_name || '').toLowerCase().includes(q));
  }, [catalog, weaponDefindex, search]);

  return (
    <div className="p-4 border-b border-subtle">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
        {t('editor.pick_skin')}
      </label>
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('editor.skin_search_placeholder')}
          className="pl-8 h-9 text-sm"
        />
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-[340px] overflow-y-auto pr-1">
        {skins.map((skin) => (
          <button
            key={`${skin.weapon_defindex}-${skin.paint}`}
            type="button"
            onClick={() => onSelect(skin)}
            onMouseEnter={(e) => {
              setHoveredSkin(skin);
              const rect = e.currentTarget.getBoundingClientRect();
              setHoverPos({ x: rect.right + 12, y: rect.top });
            }}
            onMouseLeave={() => setHoveredSkin(null)}
            className={
              String(skin.paint) === String(selectedPaintId)
                ? 'aspect-[4/3] bg-bg border-2 border-accent rounded overflow-hidden shadow-glow'
                : 'aspect-[4/3] bg-bg border border-subtle rounded overflow-hidden hover:border-accent2 transition-colors'
            }
            title={skin.paint_name}
          >
            <img
              src={skin.image}
              alt={skin.paint_name}
              className="w-full h-full object-contain p-1"
              draggable={false}
              loading="lazy"
            />
          </button>
        ))}
      </div>
      {skins.length === 0 && (
        <p className="text-xs text-faint text-center py-4">No skins found</p>
      )}
      {hoveredSkin && (
        <div
          className="fixed z-50 pointer-events-none bg-elevated border border-border rounded-lg shadow-elevated p-3 w-64"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <img src={hoveredSkin.image} alt="" className="w-full h-32 object-contain mb-2" />
          <p className="text-xs font-semibold text-fg truncate">{hoveredSkin.paint_name}</p>
        </div>
      )}
    </div>
  );
}
