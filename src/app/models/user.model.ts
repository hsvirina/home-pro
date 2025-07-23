export interface User {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;

  defaultCity: string;
  favoriteCafeIds: string[];

  theme: string;
  language?: string;

  emailNotifications: boolean;
  pushNotifications: boolean;
  reviewNotifications: boolean;
  locationSharing: boolean;

  roles: string[] | null;
  shippingAddress: string | null;
}
