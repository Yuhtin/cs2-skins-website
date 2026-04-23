import { Sword, Skull, ShieldCheck, Crosshair } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { SLOT_META, SLOTS } from '../../lib/loadout-prefs';
import { getWeaponByCsItem } from '../../lib/weapons';

// Per-slot icon map. lucide-react doesn't have a "Pistol" today, so the
// pistol slot reuses Crosshair which is what the rifles category already uses.
const SLOT_ICONS = {
  PistolRound:    Crosshair,
  HalfBuyPrimary: Sword,
  FullBuyPrimary: Skull,
  Secondary:      ShieldCheck,
};

// Resolve a chosen csItem → image src using the same enriched loadout map the
// arsenal uses for skins. Falls back to the default weapon image. We look the
// row up by `weapon_${weapon.internal}.${team}` because that's how `useLoadout`
// keys regular weapon skins.
function resolveWeaponDisplay(loadout, team, csItem) {
  if (!csItem) return null;
  const weapon = getWeaponByCsItem(csItem);
  if (!weapon) return null;
  const skinKey = `${weapon.internal}.${team === 'CT' ? 'CT' : 'T'}`;
  const skinKeyShared = weapon.team === 'both' ? `${weapon.internal}.CT` : skinKey;
  const skinRow = loadout[skinKey] || loadout[skinKeyShared];
  return {
    weapon,
    image: skinRow?.image || weapon.image,
    paintName: skinRow?.paint_name,
  };
}

// Sorted slot order matches SLOT_META.order.
const ORDERED_SLOTS = [...SLOTS].sort(
  (a, b) => SLOT_META[a].order - SLOT_META[b].order,
);

export function LoadoutPrefsSection({ team, loadout, prefs, onOpenPicker }) {
  const { t } = useTranslation();
  const teamPrefs = prefs?.[team] ?? {};

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1">
          <div className="h-[2px] w-4 bg-team-accent" />
          <div className="w-0 h-0 border-l-[6px] border-l-team-accent border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
        </div>
        <h3 className="font-display font-bold text-sm uppercase tracking-[0.25em] text-team-accent whitespace-nowrap">
          {t('loadout_prefs.section_title')}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-team-border to-transparent" />
      </div>

      <p className="text-xs text-team-muted mb-5 max-w-2xl">
        {t('loadout_prefs.section_help')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {ORDERED_SLOTS.map((slot) => {
          const Icon = SLOT_ICONS[slot];
          const csItem = teamPrefs[slot];
          const display = resolveWeaponDisplay(loadout, team, csItem);

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onOpenPicker(slot)}
              className="group relative bg-team-surface border-2 border-team-border rounded-lg p-5 hover:border-team-accent transition-all text-center flex flex-col items-center justify-between gap-3 min-h-[260px] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-2 text-team-accent">
                <Icon size={14} />
                <span className="font-display font-bold text-[10px] uppercase tracking-[0.25em]">
                  {t(SLOT_META[slot].labelKey)}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                {display ? (
                  <img
                    src={display.image}
                    alt={display.weapon.displayName}
                    className="max-w-full max-h-[120px] object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <Icon size={64} className="text-team-border/50" strokeWidth={1} />
                )}
              </div>

              <div className="w-full">
                <p className="text-xs font-semibold text-team-fg truncate" title={display?.weapon.displayName}>
                  {display?.weapon.displayName ?? t('loadout_prefs.empty_slot')}
                </p>
                {display?.paintName && (
                  <p className="text-[10px] text-team-accent uppercase tracking-wider mt-0.5 truncate">
                    {display.paintName.split('|').slice(1).join('|').trim() || display.paintName}
                  </p>
                )}
                <p className="text-[10px] text-team-muted uppercase tracking-wider mt-1">
                  {t('loadout_prefs.click_to_change')}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
