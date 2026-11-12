import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { nextServer } from "@/lib/api";
import type { Notice } from "@/types/notices";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { data } = await nextServer.get<{
      noticesFavorites: Notice[];
    }>("/users/current", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const favoriteIds = data.noticesFavorites.map(
      (notice) => notice._id
    );

    return NextResponse.json(favoriteIds);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}