import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "../api";

export async function GET(request: NextRequest) {
  const keyword =
    request.nextUrl.searchParams.get("keyword")?.trim() ?? "";

  if (keyword.length < 3 || keyword.length > 48) {
    return NextResponse.json(
      { message: "Keyword must contain 3 to 48 characters" },
      { status: 400 }
    );
  }

  try {
    const response = await api.get("/cities", {
      params: { keyword },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Failed to fetch cities:",
        error.response?.data ?? error.message
      );

      return NextResponse.json(
        { message: "Failed to fetch cities" },
        { status: error.response?.status ?? 502 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}