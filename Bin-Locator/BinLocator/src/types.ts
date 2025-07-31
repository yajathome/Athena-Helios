export type BinStatus = "Available" | "Full" | "Not Found";


export interface BinData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: BinStatus;
}