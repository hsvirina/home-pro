export interface PublicReview {
  id: number;
  cafeId: number;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Review {
  id: number;
  cafeId: number;
  userId: number;
  rating: number;
  text: string;
  createdAt: string;
  userName: string;
  userSurname: string;
  userPhotoUrl: string;
}
