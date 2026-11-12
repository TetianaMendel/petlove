import type { Pet } from "./pet";
import type { Notice } from "./notices";

export interface User {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface FullUser extends User {
  _id: string;
  avatar: string;
  phone: string;
  pets: Pet[];
  noticesViewed: Notice[];
  noticesFavorites: Notice[];
  createdAt: string;
  updatedAt: string;
}