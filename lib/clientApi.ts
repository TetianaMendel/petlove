import { nextServer, apiInstance } from "./api";
import axios from "axios"

import type { NewsItem } from "@/types/news";
import type {
  Notice,
  NoticeDetails,
  NoticeCategory,
  NoticeSex,
} from "@/types/notices";
import type { City } from "@/types/cities";
import type { Friend } from "@/types/friends";
import type { FullUser } from "@/types/user";

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

export const fetchNoticeById = async (
  id: string
): Promise<NoticeDetails> => {
  const { data } = await apiInstance.get<NoticeDetails>(
    `/notices/${id}`
  );

  return data;
};

export const addNoticeToFavorites = async (id: string) => {
  const { data } = await apiInstance.post<string[]>(
    `/notices/${id}`
  );

  return data;
};

export const removeNoticeFromFavorites = async (id: string) => {
  const { data } = await apiInstance.delete<string[]>(
    `/notices/${id}`
  );

  return data;
};

export const fetchFavoriteNoticeIds = async (): Promise<string[]> => {
  const { data } = await apiInstance.get<string[]>(
    "/notices/favorites"
  );

  return data;
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  email: string;
}

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    "/api/auth/login",
    credentials
  );

  return response.data;
}

export async function logout(): Promise<void> {
  await axios.post("/api/auth/logout");
}

export async function fetchFullUser(): Promise<FullUser> {
  const response = await apiInstance.get<FullUser>(
    "/auth/current/full"
  );

  return response.data;
}

export interface AddPetRequest {
  title: string;
  name: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
}


export async function addPet(
  data: AddPetRequest
): Promise<void> {
  await apiInstance.post(
    "/auth/current/pets/add",
    data
  );
}

export async function removePet(id: string): Promise<void> {
  await apiInstance.delete(`/auth/current/pets/${id}`);
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export async function updateUser(
  data: UpdateUserRequest
): Promise<FullUser> {
  const response = await apiInstance.patch<FullUser>(
    "/auth/current/edit",
    data
  );

  return response.data;
}