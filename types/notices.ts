export interface Notice {
  _id: string;
  species: string;
  category: NoticeCategory;
  price?: number;
  title: string;
  name: string;
  birthday: string;
  comment: string;
  sex: NoticeSex;
  location: string;
  imgURL: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  popularity: number;
}

export interface NoticeLocation {
  _id: string;
  stateEn: string;
  cityEn: string;
}

export interface NoticeOwner {
  _id: string;
  email: string;
  phone: string;
}

export interface NoticeDetails
  extends Omit<Notice, "location" | "user"> {
  location: NoticeLocation;
  user: NoticeOwner;
}

export type NoticeCategory =
  | "found"
  | "free"
  | "lost"
  | "sell";

export type NoticeSex =
  | "female"
  | "male"
  | "multiple"
  | "unknown";

  export type SortOption =
  | "Popular"
  | "Unpopular"
  | "Cheap"
  | "Expensive";