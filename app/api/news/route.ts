import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { fetchNews } from "@/lib/serverApi";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);
  const keyword = searchParams.get("keyword") ?? undefined;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return NextResponse.json(
      { message: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchNews({
      page,
      limit,
      keyword,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch news:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: "Failed to fetch news" },
        { status: error.response?.status ?? 502 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}