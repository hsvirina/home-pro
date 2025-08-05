export interface Tag {
  id: number;
  key: string;  // новый ключ для сопоставления с FilterOption.key
  name: string;
}

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
  tags: Tag[];
  photoUrls: string[];
  sharedAt?: string;
}
