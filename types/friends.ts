export interface FriendWorkDay {
  _id: string;
  isOpen: boolean;
  from?: string;
  to?: string;
}

export interface Friend {
  _id: string;
  title: string;
  url: string | null;
  addressUrl: string | null;
  imageUrl: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  workDays: FriendWorkDay[] | null;
}