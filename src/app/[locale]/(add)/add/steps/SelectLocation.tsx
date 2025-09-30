import type { Address } from '@/types/Address';
import SearchBar from '@/components/SearchBar';
import { handleUseCurrentLocation } from '@/lib/utils';
import React from 'react';
import { toast } from 'sonner';

type SelectLocationProps = {
  formData: {
    building: string;
    block: string;
    road: string;
    address: string;
    postalCode: string;
    latitude: string;
    longitude: string;
  };
  setFormData: (data: any) => void;
};

const SelectLocation: React.FC<SelectLocationProps> = ({ formData, setFormData }) => {
  const handleLocationSelect = (locationDetails: Address) => {
    setFormData((prev: any) => ({
      ...prev,
      building: locationDetails.building,
      block: locationDetails.block,
      road: locationDetails.road,
      address: locationDetails.address,
      postalCode: locationDetails.postalCode,
      latitude: locationDetails.latitude.toString(),
      longitude: locationDetails.longitude.toString(),
    }));
  };

  const mapFormDataToAddress = (): Address => ({
    building: formData.building || '',
    block: formData.block || '',
    road: formData.road || '',
    address: formData.address || '',
    postalCode: formData.postalCode || '',
    latitude: Number.parseFloat(formData.latitude) || 0,
    longitude: Number.parseFloat(formData.longitude) || 0,
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Location</h2>
      <SearchBar
        onSearchAction={locationDetails => handleLocationSelect(locationDetails)}
        onUseCurrentLocationAction={() =>
          handleUseCurrentLocation(
            (latitude, longitude) =>
              handleLocationSelect({
                building: 'Your building',
                block: 'Your block',
                road: 'Your road',
                address: 'Your address',
                postalCode: 'Your postal code',
                latitude,
                longitude,
              }),
            () => toast.warning('Unable to retrieve your location. Please try again.'),
          )}
        initialLocation={mapFormDataToAddress()}
      />
    </div>
  );
};

export default SelectLocation;
