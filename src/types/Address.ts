export type Address = {
  building: string | null; // Building name, or null if not available
  block: string | null; // Block number, or null if not available
  road: string; // Road name
  address: string; // Full address
  postalCode: string; // Postal code
  latitude: number; // Latitude
  longitude: number; // Longitude
};
