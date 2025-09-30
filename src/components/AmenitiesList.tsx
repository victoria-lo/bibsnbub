import type { Amenity } from '@/models/types';
import React from 'react';
import AmenityItem from './AmenityItem';

type AmenitiesListProps = {
  amenities: {
    quantity: number;
    amenity: Amenity;
  }[];
};

const AmenitiesList: React.FC<AmenitiesListProps> = ({ amenities }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Amenities</h2>
      <ul className="mt-4 grid grid-cols-2 gap-4">
        {amenities.map(({ quantity, amenity }) => (
          <AmenityItem key={amenity.id} amenity={amenity} quantity={quantity} />
        ))}
      </ul>
    </div>
  );
};

export default AmenitiesList;
