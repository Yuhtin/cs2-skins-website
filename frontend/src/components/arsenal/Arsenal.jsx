import { Swords } from 'lucide-react';
import { IconCtShield } from '../ui/IconCtShield';
import { IconTShield } from '../ui/IconTShield';
import { getWeaponsBySection } from '../../lib/weapons';
import { ArsenalSection } from './ArsenalSection';
import { EquipmentSection } from './EquipmentSection';

export function Arsenal({ loadout, search }) {
  return (
    <div className="space-y-10 pb-16">
      <ArsenalSection
        titleKey="arsenal.ct_section"
        icon={IconCtShield}
        weapons={getWeaponsBySection('ct')}
        loadout={loadout}
        search={search}
        teamKey="CT"
      />
      <ArsenalSection
        titleKey="arsenal.t_section"
        icon={IconTShield}
        weapons={getWeaponsBySection('t')}
        loadout={loadout}
        search={search}
        teamKey="T"
      />
      <ArsenalSection
        titleKey="arsenal.shared_section"
        icon={Swords}
        weapons={getWeaponsBySection('shared')}
        loadout={loadout}
        search={search}
        teamKey={null}
      />
      <EquipmentSection loadout={loadout} />
    </div>
  );
}
