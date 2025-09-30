import { Button } from '@/components/ui/button';
import { bottleBaby } from '@lucide/lab';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ManIcon from '@mui/icons-material/Man';
import WcIcon from '@mui/icons-material/Wc';
import WomanIcon from '@mui/icons-material/Woman';
import { Accessibility, Baby, Icon } from 'lucide-react';
import React from 'react';

type SelectFacilityTypeProps = {
  facilityTypeId: string;
  setFacilityTypeId: (id: string) => void;
  facilityTypes: { id: string; name: string; description?: string; slug?: string }[];
};

const SelectFacilityType: React.FC<SelectFacilityTypeProps> = ({ facilityTypeId, setFacilityTypeId, facilityTypes }) => {
  const getIcon = (slug?: string) => {
    switch (slug) {
      case 'diaper-changing-station':
        return <BabyChangingStationIcon fontSize="small" />;
      case 'baby-room':
        return <Baby className="h-4 w-4" />;
      case 'lactation-room':
        return <Icon className="h-4 w-4" iconNode={bottleBaby} />;
      case 'restroom-accessible':
        return <Accessibility className="h-4 w-4" />;
      case 'restroom-ladies':
        return <WomanIcon fontSize="small" />;
      case 'restroom-mens':
        return <ManIcon fontSize="small" />;
      case 'restroom-family':
        return <FamilyRestroomIcon fontSize="small" />;
      case 'restroom-unisex':
        return <WcIcon fontSize="small" />;
      default:
        return null;
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Which of these best describes the facility?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {facilityTypes.map(type => (
          <Button
            key={type.id}
            variant={facilityTypeId === type.id ? 'default' : 'outline'}
            onClick={() => setFacilityTypeId(type.id)}
            className="w-full h-auto overflow-hidden justify-start items-start text-left px-4 py-2"
          >
            <div className="flex w-full items-start gap-2 overflow-hidden">
              <div className="shrink-0 rounded-md bg-muted text-foreground/80 h-7 w-7 grid place-items-center">
                {getIcon(type.slug)}
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="font-semibold leading-snug break-words whitespace-normal">
                  {type.name}
                </p>
                {type.description && (
                  <p className="text-xs text-muted-foreground mt-0 leading-snug break-words whitespace-normal">
                    {type.description}
                  </p>
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SelectFacilityType;
