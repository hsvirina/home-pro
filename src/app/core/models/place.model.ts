export interface Place {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  city: string;
  address: string;
  workingHours: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  photoUrls: string[];
}
