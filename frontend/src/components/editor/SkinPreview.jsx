import { useTranslation } from '../../hooks/useTranslation';

export function SkinPreview({ weapon, skin, wear }) {
  const { t } = useTranslation();
  const skinName = skin?.paint_name || 'Default';
  const wearTier = wearTierLabel(wear, t);

  return (
    <div className="p-4 border-b border-subtle">
      <div className="bg-bg rounded-md h-40 flex items-center justify-center mb-3 border border-subtle">
        <img
          src={skin?.image || weapon.image}
          alt={skinName}
          className="max-w-full max-h-full object-contain drop-shadow-xl"
          draggable={false}
        />
      </div>
      <h3 className="font-semibold text-sm text-fg truncate">{skinName}</h3>
      <p className="text-xs text-faint mt-0.5">{wearTier}</p>
    </div>
  );
}

function wearTierLabel(wear, t) {
  if (wear == null) return '—';
  if (wear < 0.07) return t('editor.wear_tier_fn');
  if (wear < 0.15) return t('editor.wear_tier_mw');
  if (wear < 0.38) return t('editor.wear_tier_ft');
  if (wear < 0.45) return t('editor.wear_tier_ww');
  return t('editor.wear_tier_bs');
}
