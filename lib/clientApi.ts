import { nextServer } from "./api";
import axios from "axios"

import type { NewsItem } from "@/types/news";
import type {
  Notice,
  NoticeCategory,
  NoticeSex,
} from "@/types/notices";
import type { City } from "@/types/cities";
import type { Friend } from "@/types/friends";

export interface NewsResponse {
  results: NewsItem[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface FetchNewsParams {
  page: number;
  limit?: number;
  keyword?: string;
}

export const fetchNews = async ({
  page,
  limit = 6,
  keyword,
}: FetchNewsParams): Promise<NewsResponse> => {
  const response = await nextServer.get<NewsResponse>(
    "/news",
    {
      params: {
        page,
        limit,
        keyword,
      },
    }
  );

  return response.data;
};

export interface NoticesResponse {
  results: Notice[];
  page: number;
  perPage: number;
  totalPages: number;
}

export interface NoticesParams {
  keyword?: string;
  category?: NoticeCategory;
  species?: string;
  locationId?: string;
  sex?: NoticeSex;
  byDate?: boolean;
  byPrice?: boolean;
  byPopularity?: boolean;
  page?: number;
  limit?: number;
}

export const fetchNotices = async (
  params: NoticesParams = {}
): Promise<NoticesResponse> => {
  const response = await nextServer.get<NoticesResponse>(
    "/notices",
    { params }
  );

  return response.data;
};

export const fetchNoticeCategories = async (): Promise<
  NoticeCategory[]
> => {
  const response = await nextServer.get<NoticeCategory[]>(
    "/notices/categories"
  );

  return response.data;
};

export const fetchNoticeSex = async (): Promise<
  NoticeSex[]
> => {
  const response = await nextServer.get<NoticeSex[]>(
    "/notices/sex"
  );

  return response.data;
};

export const fetchNoticeSpecies = async (): Promise<
  string[]
> => {
  const response = await nextServer.get<string[]>(
    "/notices/species"
  );

  return response.data;
};

export const fetchCities = async (
  keyword: string
): Promise<City[]> => {
  const response = await nextServer.get<City[]>(
    "/cities",
    {
      params: { keyword },
    }
  );

  return response.data;
};

export const fetchFriends = async (): Promise<Friend[]> => {
  const response = await nextServer.get<Friend[]>("/friends");

  return response.data;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  name: string;
  email: string;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    "/api/auth/register",
    data
  );

  return response.data;
};