export type BusinessCategory =
  | "Cafe"
  | "Restaurant"
  | "Bakery"
  | "Gym"
  | "Salon"
  | "Bookstore";

export type BusinessLocation =
  | "Downtown"
  | "Uptown"
  | "Riverside"
  | "Midtown";

export type RatingBreakdown = {
  quality: number; // 0..5
  service: number; // 0..5
  value: number; // 0..5
};

export type Review = {
  id: string;
  businessId: string;
  authorName: string;
  createdAtISO: string;
  ratings: RatingBreakdown;
  overall: number; // 0..5
  title: string;
  body: string;
};

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  location: BusinessLocation;
  shortDescription: string;
  addressLine: string;
  averageRating: number; // 0..5
  ratingCount: number;
  averageBreakdown: RatingBreakdown; // 0..5
};

