import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 6);
  const keyword = searchParams.get("keyword") ?? "";

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
    const response = await api.get("/news", {
      params: {
        page,
        limit,
        ...(keyword && { keyword }),
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Failed to fetch news:", error.response?.data);

      return NextResponse.json(
        { message: "Failed to fetch news" },
        { status: error.response?.status ?? 502 }
      );
    }

    console.error("Internal server error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}