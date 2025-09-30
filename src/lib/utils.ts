import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toRadians = (deg: number) => (deg * Math.PI) / 180;

export const calculateDistance = (userLat: number, userLon: number, locLat: number, locLon: number) => {
  const R = 6371; // Earth's radius in KM
  const dLat = toRadians(locLat - userLat);
  const dLon = toRadians(locLon - userLon);
  const lat1 = toRadians(userLat);
  const lat2 = toRadians(locLat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export async function fetchTranslations(locale: string) {
  return await getTranslations({ locale, namespace: 'Index' });
}

export const handleUseCurrentLocation = async (
  onLocationSuccess: (latitude: number, longitude: number) => void,
  onLocationError?: () => void,
) => {
  if (!navigator.geolocation) {
    toast.warning('Geolocation Not Supported', {
      description: 'Geolocation is not supported by your browser.',
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      onLocationSuccess(latitude, longitude);
      toast.success('Location Updated', {
        description: 'Your location has been updated to your current location.',
      });
    },
    (error) => {
      console.error('Error fetching current location:', error);
      toast.warning('Error', {
        description: 'Unable to retrieve your location. Please try again.',
        action: {
          label: 'Try Again',
          onClick: () => {
            if (onLocationError) {
              onLocationError();
            }
          },
        },
      });
    },
  );
};
