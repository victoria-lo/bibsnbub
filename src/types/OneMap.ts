export type OneMapApiResponse = {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapResult[];
};

export type OneMapResult = {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
  LONGTITUDE?: string; // Typo in the API, but included for completeness
};
