import "server-only";

import { cookies } from "next/headers";
import { nextServer } from "./api";

export interface CurrentUser {
  name: string;
  email: string;
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
  };
}