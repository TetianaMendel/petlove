import "server-only";

import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { FullUser } from "@/types/user";

export interface CurrentUser {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const response = await nextServer.get<CurrentUser>(
    "/users/current",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    name: response.data.name,
    email: response.data.email,
    avatar: response.data.avatar,
    phone: response.data.phone,
  };
}

export async function getFullUser(): Promise<FullUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const response = await nextServer.get<FullUser>(
    "/users/current/full",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const {
    _id,
    name,
    email,
    avatar,
    phone,
    pets,
    noticesViewed,
    noticesFavorites,
    createdAt,
    updatedAt,
  } = response.data;

  return {
    _id,
    name,
    email,
    avatar,
    phone,
    pets,
    noticesViewed,
    noticesFavorites,
    createdAt,
    updatedAt,
  };
}